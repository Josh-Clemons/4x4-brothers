import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from '../assets/4x4-brothers-words-only.jpg';

function CustomNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt="Club logo"
                        src={logo}
                        width="300"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="events">Events</Nav.Link>
                    <Nav.Link href="merch">Merch</Nav.Link>
                    <Nav.Link href="https://www.facebook.com/groups/253653171083360/" target="_blank">Facebook</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default CustomNav;
