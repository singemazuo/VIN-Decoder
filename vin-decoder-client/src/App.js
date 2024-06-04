import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import VinForm from './Forms/VinForm';
import Account from './Auth/Account';
import Login from './Auth/Login';
import EditForm from './Forms/EditForm';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './Auth/AuthContext';
import Inventory from './Inventory';
import Register from './Auth/Register';
import AddCustomer from './AddCustomer';
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
                        <Route path='/add-customer' element={<AddCustomer />}/>
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
