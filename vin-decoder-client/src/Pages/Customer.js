import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Customer.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]); 
    const [selectedCustomers, setSelectedCustomers] = useState([]); 

    // Fetch customers from the backend when the component mounts
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

    // Handler to navigate to add customer page
    const handleAddCustomer = () => {
        navigate('/add-customer');
    };

    // Handler to navigate to edit customer page with the selected customer's data
    const handleEdit = (customer) => {
        navigate('/add-customer', { state: { customer } });
    };

    // Handler to delete a customer
    const handleDelete = async (customer) => {
        const confirmed = window.confirm(`Are you sure you want to delete customer ${customer.firstname} ${customer.lastname}?`);
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:5000/customer/${customer.id}`);
            setCustomers(customers.filter(c => c.id !== customer.id)); // Remove deleted customer from state
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    // Handler to select or deselect a customer
    const handleSelectCustomer = (customerId) => {
        setSelectedCustomers(prevState => {
            if (prevState.includes(customerId)) {
                return prevState.filter(id => id !== customerId); // Deselect customer if already selected
            } else {
                return [...prevState, customerId]; // Select customer
            }
        });
    };

    // Handler to navigate to the marketing page with selected customers' phone numbers
    const handleSmsMarketing = () => {
        const selectedNumbers = customers
            .filter(customer => selectedCustomers.includes(customer.id))
            .map(customer => customer.phone);
        navigate('/marketing', { state: { phoneNumbers: selectedNumbers } });
    };

    return (
        <>
            {/* Sidebar component */}
            <div className={styles.sideBar}>
                <Sidebar />
            </div>
            {/* Navigation bar component */}
            <div className={styles.navBar}>
                <NavigationBar />
            </div>
            {/* Main customer page content */}
            <div className={styles.customerPage}>
                <div className={styles.customerTop}>
                    {/* Button to add a new customer */}
                    <button className={styles.btnAddCustomer} onClick={handleAddCustomer}>
                        <img src="/add.svg" alt="Add" className={styles.addIcon} />
                        Add Customer
                    </button>
                    {/* Button to go to SMS Marketing page */}
                    <button className={styles.btnSmsMarketing} onClick={handleSmsMarketing}>
                        <img src="icons/smartphone.svg" alt="SMS" className={styles.smsIcon} />
                        SMS Marketing
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
                                    <td>
                                        {/* Checkbox to select or deselect a customer */}
                                        <input 
                                            type="checkbox" 
                                            onChange={() => handleSelectCustomer(customer.id)} 
                                            checked={selectedCustomers.includes(customer.id)}
                                        />
                                    </td>
                                    <td>{`${customer.firstname} ${customer.lastname}`}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.group}</td>
                                    <td className={styles.tdTotalOrders}>{customer.total_orders}</td>
                                    <td className={styles.actionIcons}>
                                        {/* Edit button */}
                                        <button onClick={() => handleEdit(customer)} className={styles.btnEdit}>
                                            <img src='./icons/edit.svg' className={styles.editIcon} alt='edit'></img>
                                        </button>
                                        {/* Delete button */}
                                        <button onClick={() => handleDelete(customer)} className={styles.btnDelete}>
                                            <img src='./icons/delete.svg' className={styles.deleteIcon} alt='delete'></img>
                                        </button>
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
