import NavHeader from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { Container } from "react-bootstrap";

function DefaultLayout() {
    return(
        <Container fluid className="px-0 d-flex flex-column min-vh-100"> 
            <NavHeader/> 
            <Outlet/> 
            <Footer/> 
        </Container>
    );
}

export default DefaultLayout;