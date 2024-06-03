import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Customer.module.css';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const handleAddCustomer = () => {
        navigate('/add-customer');
    };

    const handleEdit = (customer) => {
        navigate('/add-customer', { state: { customer } });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/customer/${id}`);
            setCustomers(customers.filter(customer => customer.id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

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
                    <button className={styles.btnAddCustomer} onClick={handleAddCustomer}>
                        <img src="/add.svg" alt="Add" className={styles.addIcon} />
                        Add Customer
                    </button>
                </div>
                <hr className={styles.hr}></hr>
                <div className={styles.tableContainer}>
                    <table className={styles.customerTable}>
                        <thead>
                            <tr>
                                <th><input type='checkbox' /></th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Group</th>
                                <th>Total Orders</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>{`${customer.firstname} ${customer.lastname}`}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.group}</td>
                                    <td className={styles.tdTotalOrders}>{customer.totalOrders || 0}</td>
                                    <td>
                                        <button onClick={() => handleEdit(customer)}>Edit</button>
                                        <button onClick={() => handleDelete(customer.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Customer;
