import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes, useNavigate, Navigate } from 'react-router'
import { Game, Round } from '../models.mjs'
import { useState, useEffect } from 'react'
import HomePage from './HomePage'
import DefaultLayout from './DefaultLayout'
import PageNotFound from './PageNotFound'
import GamePage from './GamePage'
import API from '../API.mjs'
import { LoginForm } from './AuthComponents.jsx'
import ProfilePage from './ProfilePage.jsx';

function App() {
  const navigate = useNavigate();

  const [game, setGame] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setIsLoggedIn(true);
        setUser(user);
      } catch(err) {
      }
    };
    checkAuth();
  }, []);

  const handleCreateGame = async () => {
    const newGame = await API.createGame(new Game(user.id));
    const initialCards = await API.getRandomCardsForGame(newGame.id, 3, true);
    newGame.cards = initialCards.sort((a, b) => a.misfortune - b.misfortune);
    await API.createRound(new Round(newGame.id, initialCards));

    setGame(newGame);
    navigate("/game");
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setIsLoggedIn(true);
      setMessage({msg: `Benvenuto, ${user.username}!`, type: 'success'});
      setUser(user);
    } catch(err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setIsLoggedIn(false);
    setMessage('');
  };

  return (
    <Routes>
        <Route element={<DefaultLayout isLoggedIn={isLoggedIn} isPlaying={isPlaying} handleLogout={handleLogout} message={message} setMessage={setMessage}/>}>
          <Route path='/' element={<HomePage createGame={handleCreateGame} isLoggedIn={isLoggedIn}/>} />
          <Route path='/profile' element={isLoggedIn ? <ProfilePage user={user} setMessage={setMessage}/> : <Navigate replace to='/login' />} />
          <Route path='/game' element={<GamePage game={game} setGame={setGame} createGame={handleCreateGame} setIsPlaying={setIsPlaying} isLoggedIn={isLoggedIn}/>}/>
          <Route path='/login' element={isLoggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
          <Route path='*' element={<PageNotFound/>} />
        </Route>
    </Routes>
  )
}

export default App
