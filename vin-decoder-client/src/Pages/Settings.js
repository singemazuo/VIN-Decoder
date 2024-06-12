import React from "react";
import Sidebar from "../Navigation/Sidebar";
import NavigationBar from "../Navigation/NavigationBar";
import styles from './Settings.module.css';

const Settings = () => {


    return (
        
        <>
         <div className={styles.sideBar}>
            <Sidebar/>
        </div>
        <div className={styles.navBar}>
            <NavigationBar/>
        </div>
        <div className={styles.title}>
            <h1>Settings</h1>
        </div>
        </>
    );
};

export default Settings;