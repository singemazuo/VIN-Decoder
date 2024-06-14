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
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerAddress: "",
    sellerName: "",
    sellerAddress: "",
    make: "",
    model: "",
    bodyType: "",
    year: "",
    color: "",
    milage: "",
    vin: "",
    salePrice: "",
  });

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
        const response = await axios.get(
          "http://localhost:5000/unsold-vehicles"
        );
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchCustomers();
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(
        (c) => c.id === parseInt(selectedCustomer)
      );
      if (customer) {
        setFormData((prevData) => ({
          ...prevData,
          buyerName: `${customer.firstname} ${customer.lastname}`,
          buyerAddress: customer.address,
        }));
      }
    }
  }, [selectedCustomer, customers]);

  useEffect(() => {
    if (selectedVehicle) {
      const vehicle = vehicles.find((v) => v.id === parseInt(selectedVehicle));
      if (vehicle) {
        setFormData((prevData) => ({
          ...prevData,
          make: vehicle.make,
          model: vehicle.model,
          bodyType: vehicle.body_type,
          year: vehicle.year,
          color: vehicle.exterior_color,
          milage: vehicle.milage,
          vin: vehicle.vin,
          salePrice: "",
        }));
      }
    }
  }, [selectedVehicle, vehicles]);

  const handlePrint = () => {
    const printContent = document.getElementById('printableForm');
    const windowPrint = window.open('', '', 'width=900,height=650');
    windowPrint.document.write('<html><head><title>Print Form</title>');
    windowPrint.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } }</style>'); // Add any styles you need here
    windowPrint.document.write('</head><body >');
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.write('</body></html>');
    windowPrint.document.close();
    windowPrint.print();
  };

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
        <button className={styles.btnPrint} onClick={handlePrint}>
          <img
            src="./icons/print.svg"
            alt="edit"
            className={styles.printIcon}
          />
          Print form
        </button>
        <button className={styles.btnClear}>
          <img
            src="./icons/eraser.svg"
            alt="edit"
            className={styles.editIcon}
          />
          Clear form
        </button>
      </div>
      <div className={styles.orderSection}>
        <div className={styles.orderForm} id="printableForm">
          <h2>MOTOR VEHICLE BILL OF SALE</h2>
          <br />
          <p>
            1. THE PARTIES. This transaction is made in the City/Town of{" "}
            <input className={styles.inputTown} placeholder="           Enter Town"/>,{" "}
          </p>
          <p>
            Province of{" "}
            <input
              className={styles.inputProv}
              placeholder="        Enter province"
            />
            on <input placeholder="     Enter Date" className={styles.inputDate}></input>, 20<input placeholder="YY" className={styles.inputYear}></input> by and between:
          </p>
          <p>
            Buyer: {formData.buyerName} with a mailing address of&nbsp;
            {formData.buyerAddress}, and agrees to purchase the
            Vehicle from:
          </p>
          <p>
            Seller: {formData.sellerName} with a mailing address of
            {formData.sellerAddress}, and agrees to sell the Vehicle
            to the Buyer under the following terms:
          </p>
          <br />
          <h3>2. VEHICLE DESCRIPTION</h3>
          <p>
            Make: {formData.make} <br></br>
            Model: {formData.model} <br></br>
            {formData.bodyType}
            Year: {formData.year} <br></br>
            Color: {formData.color} <br></br>
            Odometer: {formData.milage} km
          </p>
          <p>Vehicle Identification Number (VIN): {formData.vin}</p>
          <br />
          <h3>3. Payment</h3>
          <p>
            The Seller agrees to transfer ownership and possession of the
            Vehicle for: (check one)
          </p>
          <p>
            <input type="checkbox" /> - Cash &emsp;&emsp;
            <input type="checkbox" /> - Check &emsp;&emsp;
            <input type="checkbox" /> - E-Transfer&emsp;&emsp;
            <input type="checkbox" /> - Debit/Credit{" "}
          </p>
          <p>
            The Buyer agrees to pay $
            <input
              className={styles.inputPrice}
              placeholder=" Enter Sale Price"
            />{" "}
            to the Seller.
          </p>
          <p>Additional Comments:</p>
          <textarea className={styles.textbox} type="text"></textarea>
          <br></br>
          <div className={styles.signatures}>
            <div className={styles.buyerSignature}>
              <input className={styles.buyerInput}></input>
              <span>Signature of buyer</span>
            </div>
            <div className={styles.sellerSignature}>
            <input className={styles.sellerInput}></input>
            <span>Signature of seller</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateOrder;
