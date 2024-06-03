import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import VinForm from './VinForm';
import Account from './Account';
import Login from './Login';
import EditForm from './EditForm';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import Inventory from './Inventory';
import Register from './Register';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Customer from './Customer';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/customers" element={<Customer/>}/>
                        <Route path="/vin-form" element={<VinForm />} />
                        <Route path='/edit-form' element={<EditForm/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/account" element={
                            <PrivateRoute>
                                <Account />
                            </PrivateRoute>
                        } />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
