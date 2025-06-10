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
        const sql = "SELECT * FROM Card WHERE id NOT IN (SELECT cardId FROM Round WHERE gameId = ?) ORDER BY RANDOM() LIMIT ?";
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

const addRound = (round) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Round(gameId, cardId, number, startTime) VALUES(?, ?, ?, ?)";
        db.run(sql, [round.gameId, round.cardId, round.number, round.startTime], function (err) {
            if (err) reject(err);
            else resolve({ message: "Round added successfully.", id: this.lastID });
        });
    });
}

const getLatestRoundForGame = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Round WHERE gameId = ? ORDER BY number DESC LIMIT 1";
        db.get(sql, [gameId], (err, row) => {
            if (err) reject(err);
            else if (row) resolve(new Round(row.gameId, row.cardId, row.number, row.startTime, row.endTime, row.result, row.id));
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

const listUserGames = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Game WHERE userId = ?";
        db.all(sql, [userId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(row => new Game(row.userId, row.date, row.result, row.id)));
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
    listUserGames,
    addCard,
    addUser
};