import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from './NavigationBar.module.css';

const NavigationBar = () => {
    return (
        <div className={styles.navWrapper}>
            <Navbar className={styles.customNav}>
                <Container>
                    <Nav className="ms-auto">
                        <img src="/images/user.png" alt="User" className={styles.userImage} />
                        <Nav.Link href="/account" className={styles.accountLink}>Account</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavigationBar;
