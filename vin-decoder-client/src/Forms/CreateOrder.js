import React, { useEffect, useState } from "react";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from  "./CreateOrder.module.css"
import axios from "axios";

const CreateOrder = () => {
    const [vehicle, setVehicle] = useState([]); 
    const [customer, setCustomer] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");

    useEffect(() =>{

        const fetchCustomers = async () => {
            try {
                
            } catch (error) {
                console.error("Error fetching customers", error);
            }
        };

        const fetchVehciles = async () => {
            try {
                
            } catch (error) {
                console.error("Error fetching vehicles", error);
            }
        };


    },[]);

    return (
        <>
            <div className={styles.sideBar}>
                <Sidebar/>
            </div>
            <div className={styles.navBar}>
                <NavigationBar/>
            </div>
        </>
    );
};

export default CreateOrder;