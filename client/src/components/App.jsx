import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router'
import HomePage from './HomePage'
import DefaultLayout from './DefaultLayout'
import PageNotFound from './PageNotFound'
import GamePage from './GamePage'

function App() {
  return (
    <Routes>
        <Route element={<DefaultLayout/>}>
          <Route path='/' element={<HomePage/>} />
          <Route path='/game' element={<GamePage/>} />
          <Route path='*' element={<PageNotFound/>} />
        </Route>
    </Routes>
  )
}

export default App
