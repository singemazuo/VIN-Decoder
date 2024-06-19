import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider component to provide authentication context to its children
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');

    // Function to register a new user
    const register = async (email, password, firstName, lastName) => {
        try {
            await axios.post('http://localhost:5000/register', { email, password, firstName, lastName }, { withCredentials: true });
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    // Function to log in an existing user
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true });
            console.log('Login response:', response.data);  
            if (response.data.isAuthenticated) {
                // Set authentication state and user information
                setIsAuthenticated(true);
                setUserEmail(email);
                setFirstName(response.data.firstName);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    // Function to log out the user
    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
            // Reset authentication state and user information
            setIsAuthenticated(false);
            setUserEmail('');
            setFirstName('');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Effect to check authentication status when the component mounts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/protected', { withCredentials: true });
                if (response.status === 200) {
                    // Set authentication state and user information if the user is authenticated
                    setIsAuthenticated(true);
                    setFirstName(response.data.firstName);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };

        checkAuth();
    }, []);

    // Provide authentication context to children components
    return (
        <AuthContext.Provider value={{ isAuthenticated, firstName, userEmail, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
