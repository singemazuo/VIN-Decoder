// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; 

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>Admin Panel</h2>
            </div>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <NavLink to="/" exact activeClassName={styles.active}>
                            <span className={styles.icon}>🏠</span> Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/products" activeClassName={styles.active}>
                            <span className={styles.icon}>🛍️</span> Inventory
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/customers" activeClassName={styles.active}>
                            <span className={styles.icon}>👤</span> Customers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" activeClassName={styles.active}>
                            <span className={styles.icon}>📦</span> Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" activeClassName={styles.active}>
                            <span className={styles.icon}>⚙️</span> Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
