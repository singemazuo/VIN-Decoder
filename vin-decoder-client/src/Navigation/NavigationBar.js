import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation } from 'react-router-dom';
import styles from './NavigationBar.module.css';

const NavigationBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const getLocationName = (path) => {
        switch (path) {
            case '/':
                return 'Dashboard';
            case '/inventory':
                return 'Inventory';
            case '/customers':
                return 'Customers';
            case '/reports':
                return 'Reports';
            case '/orders':
                return 'Orders';
            case '/loan':
                return 'Calculators / Loan Calculator';
            case '/lease':
                return 'Calculators / Lease Calculator';
            case '/settings':
                return 'Settings';
            case '/add-customer':
                return 'Add Customer';
            case '/vin-form':
                return 'VIN Form';
            case '/edit-form':
                return 'Edit Form';
            case '/register':
                return 'Register';
            case '/create-order':
                return 'Create Order';
            case '/account':
                return 'Account';
            case '/login':
                return 'Login';
            default:
                return '';
        }
    };

    const navlocation = getLocationName(currentPath);

    return (
        <div className={styles.navWrapper}>
            <Navbar className={styles.customNav}>
                <Container>
                    <Nav className="ms-auto">
                        <p className={styles.location}>Home / {navlocation}</p>
                        <img src="/images/user.png" alt="User" className={styles.userImage} />
                        <Nav.Link href="/account" className={styles.accountLink}>Account</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavigationBar;
