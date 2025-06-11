import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import NavHeader from './Navbar'
import Footer from './Footer'

function App() {
  return (
    <>
      <NavHeader />
      
      <Container fluid className="d-flex flex-column min-vh-100">
      </Container>

      <Footer />
    </>
  )
}

export default App
