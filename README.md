# Exam #1: "Gioco della Sfortuna"
## Student: s334165 ARECCO GIULIO

## React Client Application Routes

- Route `/`: Homepage with game introduction and start button. Shows different content for logged in users (full game rules) vs non-logged in users (simplified rules and demo option).

- Route `/game`: The game interface where players try to place misfortune cards in the correct position. Protected by the `isPlaying` state - once a game starts, navigation is restricted until the game ends.

- Route `/profile`: User profile page showing the history of completed games, including details of each round, cards collected, and game results. Only accessible to authenticated users.

- Route `/login`: Login page with form for email and password. Redirects to homepage upon successful authentication.

## API Server

### Game Management

#### POST `/api/games`
- Request body: `{ userId: number }`
- Response: `{ id: number, userId: number, date: string, result: string|null }`
- Creates a new game for the specified user

#### GET `/api/games/:gameId/randomCards`
- Request parameters: 
  - `gameId`: ID of the game
  - `n`: Number of cards to retrieve
  - `getMisfortune`: Boolean indicating whether to include misfortune values
- Response: Array of card objects `[{ id: number, name: string, imagePath: string, misfortune: number|null }]`
- Returns random cards not yet used in the specified game

#### PATCH `/api/games/:gameId`
- Request parameters: `gameId`: ID of the game
- Request body: `{ result: string }` (either "win" or "loss")
- Response: Updated game object
- Updates the result of a game

### Round Management

#### POST `/api/rounds`
- Request body: `{ gameId: number, cards: Array<{id: number}> }`
- Response: Round object with cards
- Creates a new round for the specified game

#### PATCH `/api/rounds/:roundId`
- Request parameters: `roundId`: ID of the round
- Request body: `{ result: string }` (either "win" or "loss")
- Response: Updated round object
- Updates the result of a round

### Card Management

#### GET `/api/cards/:cardId`
- Request parameters: `cardId`: ID of the card
- Response: Card object with all details
- Returns detailed information about a specific card

### User Management

#### GET `/api/users/:userId/games`
- Request parameters: `userId`: ID of the user
- Response: Array of game objects with nested rounds and cards
- Protected by `isLoggedIn` middleware
- Returns all completed games for a user with full details

#### POST `/api/sessions`
- Request body: `{ username: string, password: string }`
- Response: User object without sensitive data
- Authenticates a user and creates a session

#### GET `/api/sessions/current`
- Response: Current user object or 401 error
- Returns the currently authenticated user

#### DELETE `/api/sessions/current`
- Response: Empty response with 200 status
- Logs out the current user by destroying the session

## Database Tables

- Table `User`: Contains `id`, `username`, `email`, `salt`, `password` for user authentication and identification.

- Table `Game`: Contains `id`, `userId`, `date`, `result` to track game sessions and outcomes.

- Table `Round`: Contains `id`, `gameId`, `number`, `startTime`, `endTime`, `result` to track individual rounds within a game.

- Table `Card`: Contains `id`, `name`, `imagePath`, `misfortune` to store card information with their misfortune indices.

- Table `RoundCard`: Contains `roundId`, `cardId` to establish the many-to-many relationship between rounds and cards.

## Main React Components

- `App` (in App.jsx): Main application component that manages routing, authentication state, and game creation. Contains the main application state including user information, current game, and playing status.

- `HomePage` (in HomePage.jsx): Displays welcome message, game rules, and a button to start a new game. Shows different content based on login status.

- `GamePage` (in GamePage.jsx): Complex component that manages the entire game flow including rounds, timer, card placement, and win/loss conditions. Contains nested components for different game states (start, in-game, end-game).

- `CardsForm` (in GamePage.jsx): Handles the user interaction for placing cards in the correct position, with radio buttons between existing cards.

- `ProfilePage` (in ProfilePage.jsx): Displays user's game history with details about each game, including rounds played, cards collected, and game results.

- `NavHeader` (in Navbar.jsx): Navigation bar with conditional rendering based on authentication status and game state. Links are disabled during active gameplay.

- `CardsDisplay` (in CardsDisplay.jsx): Horizontal display of cards with their details, used in multiple components.

- `GameCard` (in GameCard.jsx): Individual card display with image, name and optional misfortune value.

- `DefaultLayout` (in DefaultLayout.jsx): Layout wrapper that includes the navbar, content area, and footer.

## Screenshots

![Game Screenshot 1](./screenshots/screen1.png)
![Game Screenshot 2](./screenshots/screen2.png)

## Users Credentials

- testuser1@mail.com, password
- testuser2@mail.com, password