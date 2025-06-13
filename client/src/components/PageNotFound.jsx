import { Container } from "react-bootstrap";

function PageNotFound() {
    return (
        <Container fluid className="text-center">
              <p className="text-danger fs-1 mt-5">Pagina non trovata</p>
        </Container>
    );
}

export default PageNotFound;