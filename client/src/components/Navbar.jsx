import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LogoutButton } from './AuthComponents.jsx';

function NavHeader(props) {
    const handleDisabledClick = (e) => {
        if (props.isPlaying) {
            e.preventDefault();
        }
    };
    
    return(
        <Navbar bg='primary' data-bs-theme='dark' sticky='top'>
            <Navbar.Brand as={Link} to='/' className={`ms-4 fs-3 ${props.isPlaying ? 'disabled' : ''}`} onClick={handleDisabledClick}>
                Gioco della Sfortuna
            </Navbar.Brand>
            
            <div className="ms-auto me-4 d-flex align-items-center">
                {props.isLoggedIn ? 
                    <>
                        <Link to="/profile" className={`btn btn-outline-light me-2 ${props.isPlaying ? 'disabled' : ''}`} onClick={handleDisabledClick}>
                            <i className="bi bi-person"></i>
                        </Link>
                        <LogoutButton logout={props.handleLogout} disabled={props.isPlaying}/>
                    </> :
                    <Link to='/login' className={`btn btn-outline-light ${props.isPlaying ? 'disabled' : ''}`} onClick={handleDisabledClick}>Login</Link>
                }
            </div>
        </Navbar>
    );
}

export default NavHeader;