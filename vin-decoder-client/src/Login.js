import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.module.css';

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
        <div className="login-wrapper">
            <h1 className="title">Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="container">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="loginregister">
                        <button type="submit">Login</button>
                        <button type="button" onClick={handleRegister}>Register</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
