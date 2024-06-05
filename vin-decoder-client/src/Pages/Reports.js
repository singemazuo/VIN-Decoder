import React from "react";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from  "./Reports.module.css"

const Reports = () => {

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

export default Reports;