import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./database.db', (err) => {if (err) throw err;});
main();

async function main() {
    await clearTables();
    db.close();
}

function dbInsertGame(userId, date, result) {
    return new Promise((resolve, reject) => {  
        const sql = 'INSERT INTO Game(userId, date, result) '
        + 'VALUES(?, ?, ?)';

        db.run(sql, [userId, date, result], function (err) {
            if (err) reject(err);
            else resolve("Game inserted correctly.");
        });
    });
}

function dbInsertCard(name, imagePath, misfortune) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Card(name, imagePath, misfortune) VALUES(?, ?, ?)';

        db.run(sql, [name, imagePath, misfortune], function (err) {
            if (err) reject(err);
            else resolve('Card inserted correctly.');
        });
    });
}

function dbInsertRound(gameId, cardId, number, startTime, endTime, result) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Round(gameId, cardId, number, startTime, endTime, result) '
        + 'VALUES(?, ?, ?, ?, ?, ?)';

        db.run(sql, [gameId, cardId, number, startTime, endTime, result], function (err) {
            if (err) reject(err);
            else resolve('Round inserted correctly.');
        });
    }); 
}

function dbInsertUser(username) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO User(username) VALUES(?)';

        db.run(sql, [username], function (err) {
            if (err) reject(err);
            else resolve('User inserted correctly.');
        });
    });
}

function clearTables() {
    return new Promise(async (resolve, reject) => {
        const runQuery = (sql) => {
            return new Promise((resolve, reject) => {
                db.run(sql, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        try {
            await runQuery("BEGIN TRANSACTION");
            await runQuery("DELETE FROM Round");
            await runQuery("DELETE FROM Game");
            await runQuery("DELETE FROM Card");
            await runQuery("DELETE FROM User");
            await runQuery("DELETE FROM sqlite_sequence WHERE name IN ('Card', 'Game', 'Round', 'User')");
            await runQuery("COMMIT");
            resolve("Tables cleared successfully.");
        } catch (err) {
            reject(err);
        }
    });
}
