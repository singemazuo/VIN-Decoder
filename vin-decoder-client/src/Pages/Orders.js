import React from "react";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from  "./Orders.module.css";
import { useNavigate } from 'react-router-dom';


const Orders = () => {
    const navigate = useNavigate();

    const handleCreateOrder = () => {
        navigate('/create-order');
    };

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
                            <tr>
                                <th>Buyer</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>    
                    </table>        

                </div>
            </div>
        </div>
        </>
    );
};

export default Orders;