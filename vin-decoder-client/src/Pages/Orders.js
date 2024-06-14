import React, {useEffect, useState} from "react";
import axios from 'axios';
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from  "./Orders.module.css";
import { useNavigate } from 'react-router-dom';


const Orders = () => {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const handleCreateOrder = () => {
        navigate('/create-order');
    };

    const handleEdit = () => {
        navigate('/add-customer', { state: {  } });
    };

    const handleDelete = async (customer) => {
        const confirmed = window.confirm(`Are you sure you want to delete order?`);
        if (!confirmed) return;

        try {
            await axios.delete(``);
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
        <div className={styles.sideBar}>
            <Sidebar/>
        </div>
        <div className={styles.navBar}>
            <NavigationBar/>
        </div>
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.buttonAdd} onClick={handleCreateOrder}>
                <img src="/add.svg" alt="Add" className={styles.addIcon} />
                Create Order
                </button>
            </div>
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
                                <td>{order.customer_id}</td>
                                <td>{order.vehicle_id}</td>
                                <td>{order.vehicle_id}</td>
                                <td>{order.vehicle_id}</td>
                                <td>{order.vehicle_id}</td>
                                <td>{order.sale_price}</td>
                                <td>{formatDate(order.sale_date)}</td>
                                <td className={styles.actionIcons}>
                                    <button onClick={() => handleEdit(order)} 
                                        className={styles.btnEdit}><img src='./icons/viewOrder.svg' 
                                        className={styles.editIcon} alt='edit'></img>
                                    </button>
                                    <button onClick={() => handleDelete(order)} 
                                        className={styles.btnDelete}><img src='./icons/delete.svg' 
                                        className={styles.deleteIcon} alt='delete'></img>
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