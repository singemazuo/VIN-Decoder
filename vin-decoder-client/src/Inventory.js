import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavigationBar from "./NavigationBar";
import CarMakeDropdown from "./CarMakeDropdown";
import YearDropdown from "./YearDropdown";
import { useNavigate } from "react-router-dom";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [buttonText, setButtonText] = useState("Search All");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:5000/search_vehicles",
        {
          params: {
            make: make || null,
            model: model || null,
            year: year || null,
          },
        }
      );
      setVehicles(response.data);
    } catch (error) {
      console.error("Error searching vehicles:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vehicle/${id}`);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-form?id=${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <NavigationBar />

        <div className={styles.content}>
        <Sidebar />

          <div className={styles.addSearchSection}>
            <div className={styles.addSection}>
              <button className={styles.buttonAdd}>
                <img src="/add.svg" alt="Add" className={styles.addIcon} />
                Add Vehicle
              </button>
            </div>
            <div className={styles.searchSection}>
              <h1>Search Vehicles</h1>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.searchContainer}>
                  <CarMakeDropdown
                    make={make}
                    setMake={setMake}
                    model={model}
                    setModel={setModel}
                    className={styles.makeModelDropdown}
                  />
                  <YearDropdown
                    year={year}
                    setYear={setYear}
                    className={styles.yearDropdown}
                  />
                </div>
                <button type="submit" className={styles.button7}>
                  {buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
