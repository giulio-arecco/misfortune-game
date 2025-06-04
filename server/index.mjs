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

app.use(cors(corsOptions));

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});