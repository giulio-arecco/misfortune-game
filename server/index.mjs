// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dayjs from 'dayjs';
import { query, param, body, validationResult } from 'express-validator';
import { addGame, addRound, getLatestRoundForGame, listRandomCardsForGame, updateGameResult, updateRoundResult, listUserGamesWithRoundsAndCards } from './dao.mjs';
import { Round } from './models.mjs';

// init express
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use('/images', express.static('public/images'));

const intOrNullValidator = (value, { path }) => {
    if (value === null) return true;
    const n = Number(value);
    if (!isNaN(n) && Number.isInteger(n) && n > 0) return true;
    throw new Error(`Field "${path}" must be either null or a positive integer`);
};

// cors setup
const corsOptions = {
    origin: 'http://localhost:5173', 
    optionsSuccessStatus: 200, 
    credentials: true
};
app.use(cors(corsOptions));

// routes
// POST /api/games
app.post('/api/games', [
    body('userId').optional({ nullable: true }).custom(intOrNullValidator),
    body('date').exists().bail().withMessage('Field "date" must exist')
    .isString().withMessage('Field "date" must be a string').bail()
    .notEmpty().withMessage('Field "date" must be a non-empty string'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await addGame(req.body);
      res.status(201).json(response);
    }
    catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/games/:gameId/randomCards
app.get('/api/games/:gameId/randomCards', [
    param('gameId').exists().withMessage('Param "gameId" must exist').bail()
    .isInt({ min: 1 }).withMessage('Param "gameId" must be a positive integer'),
    query('n').exists().withMessage('Query parameter "n" must exist').bail()
    .isInt({ min: 1 }).withMessage('Query parameter "n" must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await listRandomCardsForGame(req.params.gameId, parseInt(req.query.n));
      if (response.length === 0) {
          return res.status(404).json({ error: "No cards found." });
      }
      else if (response.length < parseInt(req.query.n)) {
          return res.status(206).json(response);
      }

      res.status(200).json(response);
    }
    catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }

});

// PATCH /api/games/:gameId
app.patch('/api/games/:gameId', [ 
    param('gameId').exists().withMessage('Param "gameId" must exist').bail()
    .isInt({ min: 1 }).withMessage('Param "gameId" must be a positive integer'),
    body('result').exists().withMessage('Field "result" must exist').bail()
    .isString().withMessage('Field "result" must be a string').bail()
    .notEmpty().withMessage('Field "result" must be non-empty string')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await updateGameResult(req.params.gameId, req.body.result);
      res.status(200).json(response);
    }
    catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/rounds
app.post('/api/rounds', [
  body('gameId').exists().withMessage('Field "gameId" must exist').bail()
  .isInt({ min: 1 }).withMessage('Field "gameId" must be a positive integer'),
  body('cards').exists().withMessage('Field "cards" must exist').bail()
  .isArray({ min: 1 }).withMessage('Field "cards" must be a non-empty array of Card objects'),
  body('cards.*.id').exists().withMessage('Each card must have an id').bail()
  .isInt({ min: 1 }).withMessage('Each card id must be a positive integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
    const latestRound = await getLatestRoundForGame(req.body.gameId);

    let newRoundNum = 0;
    if (latestRound) {
      newRoundNum = latestRound.number + 1;
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    
    const response = await addRound(new Round(req.body.gameId, newRoundNum, now, null, null, null, req.body.cards));
    res.status(201).json(response);
  }
  catch (err) {
      res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/rounds/:roundId
app.patch('/api/rounds/:roundId', [
    param('roundId').exists().withMessage('Param "roundId" must exist').bail()
    .isInt({ min: 1 }).withMessage('Param "roundId" must be a positive integer'),
    body('result').exists().withMessage('Field "result" must exist').bail()
    .isString().withMessage('Field "result" must be a string').bail()
    .notEmpty().withMessage('Field "result" must be a non-empty string')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await updateRoundResult(req.params.roundId, req.body.result);
      res.status(200).json(response);
    }
    catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/users/:userId/games
app.get('/api/users/:userId/games', [
    param('userId').exists().withMessage('Param "userId" must exist').bail()
    .isInt({ min: 1 }).withMessage('Param "userId" must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await listUserGamesWithRoundsAndCards(req.params.userId);
      if (response.length === 0) {
          return res.status(404).json({ error: "No games found for this user." });
      }
      res.status(200).json(response);
    }
    catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});