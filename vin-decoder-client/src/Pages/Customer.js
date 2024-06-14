import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Customer.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';
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

    const handleDelete = async (customer) => {
        const confirmed = window.confirm(`Are you sure you want to delete customer ${customer.firstname} ${customer.lastname}?`);
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:5000/customer/${customer.id}`);
            setCustomers(customers.filter(c => c.id !== customer.id));
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
                                <th>Orders</th>
                                <th className={styles.actionTitle}> &nbsp;&nbsp;&nbsp; Action</th>
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
                                    <td className={styles.tdTotalOrders}>{customer.total_orders}</td>
                                    <td className={styles.actionIcons}>
                                        <button onClick={() => handleEdit(customer)} className={styles.btnEdit}><img src='./icons/edit.svg' className={styles.editIcon} alt='edit'></img></button>
                                        <button onClick={() => handleDelete(customer)} className={styles.btnDelete}><img src='./icons/delete.svg' className={styles.deleteIcon} alt='delete'></img></button>
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
