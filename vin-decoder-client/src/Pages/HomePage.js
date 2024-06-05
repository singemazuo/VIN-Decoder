// HomePage.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './HomePage.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';
import CarMakeDropdown from '../Filters/CarMakeDropdown';
import YearDropdown from '../Filters/YearDropdown';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [buttonText, setButtonText] = useState('Search All');
    const navigate = useNavigate();

    return (
        <>
         <div className={styles.sideBar}>
            <Sidebar />
        </div>
        <div className={styles.navBar}>
            <NavigationBar/>
        </div>
            <div className={styles.mainContent}>
                <div className={styles.monthlySales}>
                   <div className={styles.monthlyNumbers}>
                        <text>$Total</text>
                        <text>#Sold</text>
                        <button className={styles.btnViewMonthly}>View Monthly Report</button>
                   </div>
                   <div className={styles.monthlyGraph}>
                    
                   </div>
                </div>

                <div className={styles.annualSales}>
                    <text>$Total</text>
                    <text>#Sold</text>
                    <button className={styles.btnViewYearly}>View Yearly Report</button>
                </div>
            </div>
        </>
       
    );
};

export default HomePage;
