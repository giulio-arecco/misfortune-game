import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router';

function HomePage() {
    return(
      <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5">
        <Button as={Link} to='/game' className="btn-lg px-5 py-3 fs-2" variant="primary">Gioca</Button>
      </Container>
    );
}

export default HomePage;