import React from 'react';
import styles from './LeaseCalc.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';

const LeaseCalc = () => {

    return (
        <>
        <div className={styles.sideBar}>
            <Sidebar/>
        </div>
        <div className={styles.navBar}>
            <NavigationBar/>
        </div>

           
        </>
    );
};

export default LeaseCalc;
