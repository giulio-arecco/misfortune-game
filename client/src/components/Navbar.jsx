import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Button } from 'react-bootstrap';

function NavHeader() {
    return(
        <Navbar bg='primary' data-bs-theme='dark' sticky='top'>
            <Navbar.Brand as='h1' className='ms-4 fs-3'>
                Gioco della Sfortuna
            </Navbar.Brand>
            
            <Button variant="outline-light" className="ms-auto me-4">
                <i className="bi bi-person"></i>
            </Button>
        </Navbar>
    );
}

export default NavHeader;