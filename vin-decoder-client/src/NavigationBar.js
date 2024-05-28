import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavigationBar = () => {
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand href="/">Vehicle App</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Search</Nav.Link>
                    <Nav.Link href="/vin-form">Upload</Nav.Link>
                    <Nav.Link href="/account">Account</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
