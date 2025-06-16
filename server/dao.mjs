import sqlite from 'sqlite3';
import { Card, Game, Round, User } from './models.mjs';

const db = new sqlite.Database('./database.db', (err) => {
    if (err) throw err;
});

// Enable foreign key constraints
db.run('PRAGMA foreign_keys = ON;', (err) => {
  if (err) console.error('Could not enable foreign keys:', err);
});

const addGame = (game) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Game(userId, date) VALUES(?, ?)";
        db.run(sql, [game.userId, game.date], function (err) {
            if (err) reject(err);
            else {
                const selectSql = "SELECT * FROM Game WHERE id = ?";
                db.get(selectSql, [game.id], (err, row) => {
                    if (err) reject(err);
                    else if (!row) reject({ status: 404, message: "Game not found." });
                    else resolve(new Game(row.userId, row.date, [], row.result, row.id));
                });
            }
        });
    });
}

const listRandomCardsForGame = (gameId, n) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM Card
            WHERE id NOT IN (
                SELECT RoundCard.cardId
                FROM RoundCard
                JOIN Round ON RoundCard.roundId = Round.id
                WHERE Round.gameId = ?
            )
            ORDER BY RANDOM()
            LIMIT ?
            `;
        db.all(sql, [gameId, n], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(row => new Card(row.name, row.imagePath, row.misfortune, row.id)));
        });
    });
}

const updateGameResult = (gameId, result) => {
    return new Promise((resolve, reject) => {
        const updateSql = "UPDATE Game SET result = ? WHERE id = ?";
        db.run(updateSql, [result, gameId], function (err) {
            if (err) reject(err);
            else {
                const selectSql = "SELECT * FROM Game WHERE id = ?";
                db.get(selectSql, [gameId], (err, row) => {
                    if (err) reject(err);
                    else if (!row) reject({ status: 404, message: "Game not found." });
                    else resolve(new Game(row.userId, row.date, [], row.result, row.id));
                });
            }
        });
    });
};

const addRound = async (round) => {
    const runAsync = (sql, params) => new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });

    let roundId;
    try {
        roundId = await runAsync(
            "INSERT INTO Round(gameId, number, startTime) VALUES(?, ?, ?)",
            [round.gameId, round.number, round.startTime]
        );

        for (const card of round.cards) {
            await runAsync(
                "INSERT INTO RoundCard(roundId, cardId) VALUES (?, ?)",
                [roundId, card.id]
            );
        }

        const roundRow = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM Round WHERE id = ?", [roundId], (err, row) => {
                if (err) reject(err);
                else if (!row) reject({ status: 404, message: "Round not found." });
                else resolve(row);
            });
        });

        const roundCards = await new Promise((resolve, reject) => {
            db.all(
                `SELECT Card.* FROM Card
                 JOIN RoundCard ON Card.id = RoundCard.cardId
                 WHERE RoundCard.roundId = ?`,
                [roundId],
                (err, rows) => {
                    if (err) reject(err);
                    else if (!rows || rows.length === 0) reject({ status: 404, message: "No cards found for the round." });
                    else resolve(rows.map(row => new Card(row.name, row.imagePath, row.misfortune, row.id)));
                }
            );
        });

        return new Round(
            roundRow.gameId,
            roundCards,
            roundRow.number,
            roundRow.startTime,
            roundRow.endTime,
            roundRow.id,
            roundRow.result
        );
    } catch (err) {
        if (roundId) {
            await runAsync("DELETE FROM Round WHERE id = ?", [roundId]).catch(() => {});
        }
        throw err;
    }
};

const getLatestRoundForGame = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Round WHERE gameId = ? ORDER BY number DESC LIMIT 1";
        db.get(sql, [gameId], (err, row) => {
            if (err) reject(err);
            else if (row) resolve(new Round(row.gameId, [], row.number, row.startTime, row.endTime, row.id, row.result));
            else resolve(null);
        });
    });
}

const updateRoundResult = (roundId, result) => {
    return new Promise((resolve, reject) => {
        const updateSql = "UPDATE Round SET result = ? WHERE id = ?";
        db.run(updateSql, [result, roundId], function (err) {
            if (err) reject(err);
            else {
                const selectSql = "SELECT * FROM Round WHERE id = ?";
                db.get(selectSql, [roundId], (err, row) => {
                    if (err) reject(err);
                    else if (!row) reject({ status: 404, message: "Round not found." });
                    else resolve(new Round(row.gameId, [], row.number, row.startTime, row.endTime, row.id, row.result));
                });
            }
        });
    });
}

const listUserGamesWithRoundsAndCards = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                Game.id AS gameId, Game.userId, Game.date, Game.result,
                Round.id AS roundId, Round.number, Round.startTime, Round.endTime, Round.result AS roundResult,
                Card.id AS cardId, Card.name AS cardName, Card.imagePath, Card.misfortune
            FROM Game
            JOIN Round ON Game.id = Round.gameId
            JOIN RoundCard ON Round.id = RoundCard.roundId
            JOIN Card ON RoundCard.cardId = Card.id
            WHERE Game.userId = ? AND Game.result IS NOT NULL
            ORDER BY Game.date DESC, Round.number ASC, Card.id ASC
        `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Group by game
                const gamesMap = new Map();
                for (const row of rows) {
                    if (!gamesMap.has(row.gameId)) {
                        gamesMap.set(row.gameId, new Game(
                            row.userId,
                            row.date,
                            [],
                            row.result,
                            row.gameId,
                        ));
                        gamesMap.get(row.gameId).rounds = [];
                    }
                    const game = gamesMap.get(row.gameId);

                    // Handle rounds
                    let round = game.rounds.find(r => r.id === row.roundId);
                    if (!round) {
                        round = new Round(
                            row.gameId,
                            [],
                            row.number,
                            row.startTime,
                            row.endTime,
                            row.roundId,
                            row.roundResult
                        );
                        game.rounds.push(round);
                    }
                    // Handle cards
                    round.cards.push(new Card(
                        row.cardName,
                        row.imagePath,
                        row.misfortune,
                        row.cardId
                    ));
                }
                resolve(Array.from(gamesMap.values()));
            }
        });
    });
}

const addCard = (card) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Card(name, imagePath, misfortune) VALUES(?, ?, ?)";
        db.run(sql, [card.name, card.imagePath, card.misfortune], function (err) {
            if (err) reject(err);
            else resolve({ message: "Card added successfully.", id: this.lastID });
        });
    });
}

const addUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO User(username, email) VALUES(?, ?)";
        db.run(sql, [user.username, user.email], function (err) {
            if (err) reject(err);
            else resolve({ message: "User added successfully.", id: this.lastID });
        });
    });
}

export {
    addGame,
    listRandomCardsForGame,
    updateGameResult,
    addRound,
    getLatestRoundForGame,
    updateRoundResult,
    listUserGamesWithRoundsAndCards,
    addCard,
    addUser
};