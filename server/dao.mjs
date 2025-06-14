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
            else resolve({ message: "Game added successfully.", id: this.lastID });
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
        const sql = "UPDATE Game SET result = ? WHERE id = ?";
        db.run(sql, [result, gameId], function (err) {
            if (err) reject(err);
            else resolve({ message: "Game updated successfully." });
        });
    });
}

const addRound = async (round) => {
    if (!round.cards || !Array.isArray(round.cards) || round.cards.length === 0) {
        throw new Error("At least one card must be associated with a round.");
    }

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

        return { message: "Round and cards added successfully.", id: roundId };
    } catch (err) {
        // Manual rollback
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
            else if (row) resolve(new Round(row.gameId, row.number, row.startTime, row.endTime, row.result, row.id));
            else resolve(null);
        });
    });
}

const updateRoundResult = (roundId, result) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Round SET result = ? WHERE id = ?";
        db.run(sql, [result, roundId], function (err) {
            if (err) reject(err);
            else resolve({ message: "Round updated successfully." });
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
                            row.number,
                            row.startTime,
                            row.endTime,
                            row.roundResult,
                            row.roundId,
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