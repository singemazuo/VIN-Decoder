import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');

    const register = async (email, password, firstName, lastName) => {
        try {
            await axios.post('http://localhost:5000/register', { email, password, firstName, lastName });
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            console.log('Login response:', response.data);  
            if (response.data.isAuthenticated) {
                setIsAuthenticated(true);
                setUserEmail(email);
                setFirstName(response.data.firstName); 
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };
    

    const logout = () => {
        setIsAuthenticated(false);
        setUserEmail('');
        setFirstName('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, firstName, userEmail, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
