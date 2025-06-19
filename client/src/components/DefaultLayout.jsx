import NavHeader from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { Container } from "react-bootstrap";
import { Row, Alert } from "react-bootstrap";

function DefaultLayout(props) {
    return(
        <Container fluid className="px-0 d-flex flex-column min-vh-100"> 
            <NavHeader isLoggedIn={props.isLoggedIn} handleLogout={props.handleLogout} isPlaying={props.isPlaying}/> 
            {props.message && <Row>
                <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            </Row>}
            <Outlet/> 
            <Footer/> 
        </Container>
    );
}

export default DefaultLayout;