import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddCustomer.module.css';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

const AddCustomer = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [group, setGroup] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/add-customer', { // Update to 5000
                firstname,
                lastname,
                email,
                address,
                group
            });
            console.log('Customer added:', response.data);
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setFirstname('');
        setLastname('');
        setEmail('');
        setAddress('');
        setGroup('');
    };

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
                <form className={styles.frmAddCustomer} onSubmit={handleSubmit}>
                    <hr />
                    <label className={styles.lblCustomer}>First Name</label>
                    <input value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    <label className={styles.lblCustomer}>Last Name</label>
                    <input value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    <label className={styles.lblCustomer}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label className={styles.lblCustomer}>Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} />
                    <label className={styles.lblCustomer}>Group</label>
                    <input value={group} onChange={(e) => setGroup(e.target.value)} />
                    <div className={styles.frmButtons}>
                        <button className={styles.btnSubmitCustomer} type='submit'>Submit</button>
                        <button className={styles.btnClearCustomer} onClick={handleClear}>Clear</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCustomer;
