import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Navigation/Sidebar";
import NavigationBar from "../Navigation/NavigationBar";
import CarMakeDropdown from "../Filters/CarMakeDropdown";
import YearDropdown from "../Filters/YearDropdown";
import PriceFilter from "../Filters/PriceFilter";
import MilageFilter from "../Filters/MilageFilter";
import YearFilter from "../Filters/YearFilter";
import { useNavigate } from "react-router-dom";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minMilage, setMinMilage] = useState("");
  const [maxMilage, setMaxMilage] = useState("");
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
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
            minMilage: minMilage || null,
            maxMilage: maxMilage || null,
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

  const handleAddVehicle = () => {
    navigate("/vin-form");
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <NavigationBar />
        <div className={styles.content}>
          <Sidebar />
          <div className={styles.topButtons}>
            <button className={styles.buttonAdd} onClick={handleAddVehicle}>
              <img src="/add.svg" alt="Add" className={styles.addIcon} />
              Add Vehicle
            </button>
            <div className={styles.displayToggle}>
              <button className={styles.btnList}>
                <img
                  src="../icons/list.svg"
                  alt="list"
                  className={styles.svgList}
                ></img>
              </button>
              <button className={styles.btnGrid}>
                <img
                  src="../icons/grid.svg"
                  alt="grid"
                  className={styles.svgGrid}
                ></img>
              </button>
            </div>
          </div>
          <hr></hr>
          <div className={styles.addSearchSection}>
            <div className={styles.addSection}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.searchContainer}>
                  <CarMakeDropdown
                    make={make}
                    setMake={setMake}
                    model={model}
                    setModel={setModel}
                    className={styles.makeModelDropdown}
                  />
                  <YearFilter />
                  <PriceFilter
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                  />
                  <MilageFilter
                    minMilage={minMilage}
                    setMinMilage={setMinMilage}
                    maxMilage={maxMilage}
                    setMaxMilage={setMaxMilage}
                  />
                </div>
                <button type="submit" className={styles.btnSearchFilter}>
                  {buttonText}
                </button>
              </form>
              
            </div>
            <div className={styles.results}>
            <table>
              <thead>
                <tr>
                  <th>Stock Number</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>VIN</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
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
      </div>
    </div>
  );
};

export default Inventory;
