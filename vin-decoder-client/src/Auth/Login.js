import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import styles from './Login.module.css'; 
import Sidebar from '../Navigation/Sidebar'; 
import NavigationBar from '../Navigation/NavigationBar';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password); // Attempt to login with the provided username and password
            navigate('/account'); 
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    // Handle navigation to the register page
    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className={styles.pageContainer}>
            <Sidebar /> {/* Sidebar component */}
            <div className={styles.contentContainer}>
                <NavigationBar /> {/* Navigation bar component */}
                <div className={styles.loginWrapper}>
                    <h1 className={styles.title}>Login</h1> {/* Login title */}
                    {/* Login form */}
                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        <div className={styles.container}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            {/* Buttons to submit login form and navigate to register page */}
                            <div className={styles.loginRegister}>
                                <button type="submit" className={styles.button}>Login</button>
                                <button type="button" onClick={handleRegister} className={styles.button}>Register</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
