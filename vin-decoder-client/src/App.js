import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import VinForm from './Forms/VinForm';
import Account from './Auth/Account';
import Settings from './Pages/Settings';
import Login from './Auth/Login';
import EditForm from './Forms/EditForm';
import PrivateRoute from './Auth/PrivateRoute';
import { AuthProvider } from './Auth/AuthContext';
import Inventory from './Pages/Inventory';
import Register from './Auth/Register';
import AddCustomer from './Forms/AddCustomer';
import Reports from './Pages/Reports';
import Orders from './Pages/Orders';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Customer from './Pages/Customer';
import LoanCalc from './Pages/LoanCalc';
import LeaseCalc from './Pages/LeaseCalc';
import CreateOrder from './Forms/CreateOrder';

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
                        <Route path='/settings' element={<Settings/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/reports" element={<Reports/>}/>
                        <Route path="/orders" element={<Orders/>}/>
                        <Route path="/loan" element={<LoanCalc/>}/>
                        <Route path="/lease" element={<LeaseCalc/>}/>
                        <Route path="/create-order" element={<CreateOrder/>}/>
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
