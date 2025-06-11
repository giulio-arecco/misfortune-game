import { Container } from 'react-bootstrap';

function Footer() {
    return (
      <footer className="bg-light text-center py-3" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <Container>
          <small className="text-muted">
            &copy; Applicazioni Web I 2025
          </small>
        </Container>
      </footer>
    );
  }

export default Footer;