import dayjs from 'dayjs';

function Card(name, imagePath, misfortune, id = null) {
    this.id = id;
    this.name = name;
    this.imagePath = imagePath;
    this.misfortune = misfortune;
}

function Game(userId, date, result = null, id = null, cards = []) {
    this.id = id;
    this.userId = userId;
    this.date = dayjs(date).format('YYYY-MM-DD');
    this.result = result;
    this.cards = cards;
}

function Round(gameId, number, startTime = null, endTime = null, result = null, id = null, cards = []) {
    this.id = id;
    this.gameId = gameId;
    this.number = number;
    this.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
    this.endTime = endTime? dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') : null;
    this.result = result;
    this.cards = cards;
}

function User(username, email, id = null) {
    this.id = id;
    this.email = email;
    this.username = username;
}

export { Card, Game, Round, User };