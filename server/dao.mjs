import sqlite from 'sqlite3';
import { Card, Game, Round, User } from './models.mjs';

const db = new sqlite.Database('./database.db', (err) => {
    if (err) throw err;
});
