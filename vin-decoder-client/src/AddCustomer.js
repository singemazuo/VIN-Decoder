import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddCustomer.module.css';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import { useNavigate, useLocation } from "react-router-dom";

const AddCustomer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const customer = location.state ? location.state.customer : null;

    const [firstname, setFirstname] = useState(customer ? customer.firstname : '');
    const [lastname, setLastname] = useState(customer ? customer.lastname : '');
    const [email, setEmail] = useState(customer ? customer.email : '');
    const [address, setAddress] = useState(customer ? customer.address : '');
    const [group, setGroup] = useState(customer ? customer.group : '');
    const [phone, setPhone] = useState(customer ? customer.phone : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (customer) {
                // Update existing customer
                await axios.put(`http://localhost:5000/customer/${customer.id}`, {
                    firstname,
                    lastname,
                    email,
                    address,
                    phone,
                    group
                });
            } else {
                // Add new customer
                await axios.post('http://localhost:5000/add-customer', {
                    firstname,
                    lastname,
                    email,
                    address,
                    phone,
                    group
                });
            }
            navigate('/customers');
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setFirstname('');
        setLastname('');
        setEmail('');
        setAddress('');
        setPhone('');
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
                <h1>{customer ? 'Edit Customer' : 'Add Customer'}</h1>
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
                    <label className={styles.lblCustomer}>Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} />
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
