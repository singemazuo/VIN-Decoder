import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');

    const register = async (email, password, firstName, lastName) => {
        try {
            await axios.post('http://localhost:5000/register', { email, password, firstName, lastName }, { withCredentials: true });
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true });
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

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUserEmail('');
            setFirstName('');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/protected', { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setFirstName(response.data.firstName);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, firstName, userEmail, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
