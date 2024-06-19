import React, { useEffect, useState } from "react";
import axios from 'axios';
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from "./Orders.module.css";
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    // State for storing orders
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Navigate to create order page
    const handleCreateOrder = () => {
        navigate('/create-order');
    };

    // Navigate to edit customer page
    const handleEdit = (order) => {
        navigate('/add-customer', { state: { order } });
    };

    // Handle delete order
    const handleDelete = async (order) => {
        const confirmed = window.confirm(`Are you sure you want to delete the order?`);
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:5000/delete_order/${order.id}`);
            // Remove deleted order from the state
            setOrders(orders.filter(o => o.id !== order.id));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    // Format date to 'MM/DD/YYYY' format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

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
            <div className={styles.container}>
                {/* Header section with 'Create Order' button */}
                <div className={styles.header}>
                    <button className={styles.buttonAdd} onClick={handleCreateOrder}>
                        <img src="/add.svg" alt="Add" className={styles.addIcon} />
                        Create Order
                    </button>
                </div>
                {/* Orders table section */}
                <div className={styles.orderSection}>
                    <div className={styles.tableSection}>
                        <table className={styles.orderTable}>
                            <thead>
                                <tr className={styles.orderTableHead}>
                                    <th>Buyer</th>
                                    <th>Make</th>
                                    <th>Model</th>
                                    <th>Year</th>
                                    <th>VIN</th>
                                    <th>Price</th>
                                    <th>Sale Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.customer_firstname} {order.customer_lastname}</td>
                                        <td>{order.vehicle_make}</td>
                                        <td>{order.vehicle_model}</td>
                                        <td>{order.vehicle_year}</td>
                                        <td>{order.vehicle_vin}</td>
                                        <td>{order.sale_price}</td>
                                        <td>{formatDate(order.sale_date)}</td>
                                        <td className={styles.actionIcons}>
                                            {/* Edit order button */}
                                            <button onClick={() => handleEdit(order)} className={styles.btnEdit}>
                                                <img src='./icons/viewOrder.svg' className={styles.editIcon} alt='edit' />
                                            </button>
                                            {/* Delete order button */}
                                            <button onClick={() => handleDelete(order)} className={styles.btnDelete}>
                                                <img src='./icons/delete.svg' className={styles.deleteIcon} alt='delete' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>        
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;
