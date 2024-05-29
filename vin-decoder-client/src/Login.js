import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import NavigationBar from './NavigationBar';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add your authentication logic here
        login();
        navigate('/account');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <>
         <NavigationBar/>
        <div className="login-wrapper">
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className={styles.container}>
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={styles.loginRegister} id='login'>
                        <button type="submit">Login</button>
                        <button type="button" onClick={handleRegister}>Register</button>
                    </div>
                </div>
            </form>
        </div>
        </>
       
    );
};

export default Login;
