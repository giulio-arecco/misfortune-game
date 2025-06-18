import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router'
import HomePage from './HomePage'
import DefaultLayout from './DefaultLayout'
import PageNotFound from './PageNotFound'
import GamePage from './GamePage'
import { useState } from 'react'

function App() {
  const [game, setGame] = useState(null)

  return (
    <Routes>
        <Route element={<DefaultLayout/>}>
          <Route path='/' element={<HomePage setGame={setGame}/>} />
          <Route path='/game' element={<GamePage game={game} setGame={setGame}/>}/>
          <Route path='*' element={<PageNotFound/>} />
        </Route>
    </Routes>
  )
}

export default App
