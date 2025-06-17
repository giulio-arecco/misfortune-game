import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function HomePage() {
  const navigate = useNavigate();

  return(
    <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5">
      <Button className="btn-lg px-5 py-3 fs-2" variant="primary" onClick={() => navigate("/startGame")}>Gioca</Button>
    </Container>
  );
}

export default HomePage;