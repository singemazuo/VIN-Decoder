import React from 'react';
import styles from './AddCustomer.module.css';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

const AddCustomer = () => {
    return (
        <>
            <div className={styles.sideBar}>
                <Sidebar />
            </div>
            <div className={styles.navBar}>
                <NavigationBar />
            </div>
            <div className={styles.addCustomerPage}>
                <h1>Add Customer</h1>
              <form className={styles.frmAddCustomer}>
                <label className={styles.lblCustomer}>First Name</label>
                <input></input>
                <label className={styles.lblCustomer}>Last Name</label>
                <input></input>
                <label className={styles.lblCustomer}>Email</label>
                <input></input>
                <label className={styles.lblCustomer}>Group</label>
                <input></input>
                <label className={styles.lblCustomer}>Status</label>
                <input></input>

              </form>
            </div>
        </>
    );
};

export default AddCustomer;
