import React from 'react';
import styles from './Customer.module.css';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

const Customer = () => {
    return (
        <>
            <div className={styles.sideBar}>
                <Sidebar />
            </div>
            <div className={styles.navBar}>
                <NavigationBar />
            </div>
            <div className={styles.customerPage}>
                <div className={styles.customerTop}>
                    <button className={styles.btnAddCustomer}>
                    <img src="/add.svg" alt="Add" className={styles.addIcon} />
                        Add Customer</button>
                </div>
                <hr className={styles.hr}></hr>
                <div className={styles.tableContainer}>
                    <table className={styles.customerTable}>
                        <thead>
                            <tr>
                                <th><input type='checkbox'/></th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Group</th>
                                <th>Status</th>
                                <th>Approved</th>
                                <th>Total Orders</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>                
                </div>
            </div>
        </>
    );
};

export default Customer;
