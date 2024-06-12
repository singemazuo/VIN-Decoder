import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; 

const Sidebar = () => {
    const [isCalcDropdownOpen, setIsCalcDropdownOpen] = useState(false);

    const toggleCalcDropdown = () => {
        setIsCalcDropdownOpen(!isCalcDropdownOpen);
    };

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
                        <NavLink to="/inventory" activeClassName={styles.active}>
                            <span className={styles.icon}>🚗</span> Inventory
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/customers" activeClassName={styles.active}>
                            <span className={styles.icon}>👨‍🔬</span> Customers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports" activeClassName={styles.active}>
                            <span className={styles.icon}>📋</span> Reports
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" activeClassName={styles.active}>
                            <span className={styles.icon}>📦</span> Orders
                        </NavLink>
                    </li>
                    <li>
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownToggle} onClick={toggleCalcDropdown}>
                                <span className={styles.icon}>&nbsp;🔢</span>&nbsp;&nbsp; Calculators
                            </div>
                            {isCalcDropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li>
                                        <NavLink to="/loan" activeClassName={styles.active}>
                                        🏦 Loan
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/lease" activeClassName={styles.active}>
                                        💰 Lease
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </div>
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
