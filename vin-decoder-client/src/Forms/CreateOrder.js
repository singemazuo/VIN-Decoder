import React, { useEffect, useState } from "react";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from "./CreateOrder.module.css";
import axios from "axios";

const CreateOrder = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/unsold-vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchCustomers();
    fetchVehicles();
  }, []);

  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.selectionSection}>
        <div className={styles.customerSelect}>
          <select
            id="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
            className={styles.dropdownCustomer}
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstname} {customer.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.vehicleSelect}>
          <select
            id="vehicle"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            required
            className={styles.dropdownVehicle}
            >
            <option value="" disabled>
              Select a vehicle
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </option>
            ))}
          </select>
        </div>
        <button className={styles.btnPopulate}>
        <img src="./icons/edit2.svg" alt="edit" className={styles.editIcon} />
            Populate form</button>
      </div>
      <div className={styles.orderForm}>
            
      </div>
    </>
  );
};

export default CreateOrder;
