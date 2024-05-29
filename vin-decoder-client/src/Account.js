import React from 'react';
import NavigationBar from './NavigationBar';
import { useAuth } from './AuthContext';

const Account = () => {
    const { firstName } = useAuth();
    console.log('First name in Account component:', firstName);  
    return (
        <>
            <NavigationBar />
            <div>
                <h1>Welcome, {firstName}</h1>
            </div>
        </>
    );
}

export default Account;
