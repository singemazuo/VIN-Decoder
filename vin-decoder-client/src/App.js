import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import VinForm from './VinForm';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/vin-form" element={<VinForm />} />
                    <Route path="/account" element={<div>Account Page</div>} /> {/* Placeholder */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
