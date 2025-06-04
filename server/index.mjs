// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

// cors setup
const corsOptions = {
    origin: 'http://localhost:5173', 
    optionSuccessStatus: 200, 
    credentials: true
};

// routes

// POST /api/games
// Crea una nuova partita

// GET /api/games/:gameId/randomCards
// Ottieni carte casuali per il gioco

// PATCH /api/games/:gameId
// Aggiorna il risultato della partita

// POST /api/rounds
// Aggiungi nuovo round (eventualmente roundNumber autoincrementato dal server)

// PATCH /api/rounds/:roundId
// Manda result del round

// GET /api/users/:userId/games
// Ottieni storico delle partite di un utente


app.use(cors(corsOptions));

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});