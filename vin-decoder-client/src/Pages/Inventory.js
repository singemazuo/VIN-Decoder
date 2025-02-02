import React, { useEffect, useState } from "react";
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
  const [isDescending, setIsDescending] = useState(true);
  const [activeView, setActiveView] = useState(localStorage.getItem("activeView") || "list");
  const [filter, setFilter] = useState("all"); 
  const [sortColumn, setSortColumn] = useState("make"); 
  const [sortOrder, setSortOrder] = useState("asc"); 

  const navigate = useNavigate();

  // Function to fetch vehicles based on current filter and sorting options
  const fetchVehicles = async () => {
    let endpoint = "http://localhost:5000/vehicles";
    if (filter === "sold") {
      endpoint = "http://localhost:5000/sold-vehicles";
    } else if (filter === "unsold") {
      endpoint = "http://localhost:5000/unsold-vehicles";
    }

    try {
      const response = await axios.get(endpoint, {
        params: {
          sortColumn,
          sortOrder,
        },
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Fetch vehicles whenever filter, sortColumn, or sortOrder changes
  useEffect(() => {
    fetchVehicles();
  }, [filter, sortColumn, sortOrder]);

  // Handle view change and store the selected view in local storage
  const handleViewChange = (view) => {
    setActiveView(view);
    localStorage.setItem("activeView", view);
  };

  // Handle search action based on selected filters
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
            sortColumn,
            sortOrder,
          },
        }
      );
      setVehicles(response.data);
    } catch (error) {
      console.error("Error searching vehicles:", error);
    }
  };

  // Handle delete action for a vehicle
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vehicle/${id}`);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  // Handle edit action for a vehicle
  const handleEdit = (id) => {
    navigate(`/edit-form?id=${id}`);
  };

  // Handle add vehicle action
  const handleAddVehicle = () => {
    navigate("/vin-form");
  };

  // Format price to CAD currency format
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      currencyDisplay: "symbol",
    }).format(price);
  };

  // Toggle sort order between ascending and descending
  const handleToggleSort = () => {
    setSortOrder(isDescending ? "asc" : "desc");
    setIsDescending(!isDescending);
  };

  // Handle change in sort column
  const handleSortChange = (e) => {
    setSortColumn(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <NavigationBar />
        <div className={styles.content}>
          <Sidebar />
          <div className={styles.topButtons}>
            {/* Button to add a new vehicle */}
            <button className={styles.buttonAdd} onClick={handleAddVehicle}>
              <img src="/add.svg" alt="Add" className={styles.addIcon} />
              Add Vehicle
            </button>
            {/* Filter buttons for all, sold, and unsold vehicles */}
            <div className={styles.soldFilter}>
              <button className={`${styles.btnAll} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
              <button className={`${styles.btnSold} ${filter === 'sold' ? styles.active : ''}`} onClick={() => setFilter('sold')}>Sold</button>
              <button className={`${styles.btnUnsold} ${filter === 'unsold' ? styles.active : ''}`} onClick={() => setFilter('unsold')}>Unsold</button>
            </div>
            {/* Dropdown to sort vehicles */}
            <div className={styles.filter}>
              <img 
                src="../icons/filter.svg"
                className={styles.iconFilter}
                alt="filter"
              ></img>
              <select className={styles.filterSelect} onChange={handleSortChange} value={sortColumn}>
                <option value="stock_number">Stock</option>
                <option value="make">Make</option>
                <option value="model">Model</option>
                <option value="year">Year</option>
                <option value="milage">Milage</option>
                <option value="vin">VIN</option>
                <option value="price">Price</option>
              </select>
              {/* Button to toggle sort order */}
              <button className={styles.btnArrow} onClick={handleToggleSort}>
                <img
                  src="../icons/arrow.svg"
                  alt="arrow"
                  className={`${styles.iconArrow} ${
                    isDescending ? "" : styles.rotated
                  }`}
                ></img>
              </button>
            </div>
            {/* Buttons to switch between list and grid view */}
            <div className={styles.displayToggle}>
              <button
                className={`${styles.btnList} ${activeView === "list" ? styles.active : ""}`}
                onClick={() => handleViewChange("list")}
              >
                <img
                  src="../icons/list.svg"
                  alt="list"
                  className={styles.svgList}
                ></img>
              </button>
              <button
                className={`${styles.btnGrid} ${activeView === "grid" ? styles.active : ""}`}
                onClick={() => handleViewChange("grid")}
              >
                <img
                  src="../icons/grid.svg"
                  alt="grid"
                  className={styles.svgGrid}
                ></img>
              </button>
            </div>
          </div>
          <hr className={styles.hr}></hr>
          {/* Form and filter section */}
          <div className={styles.addSearchSection}>
            <div className={styles.addSection}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.searchContainer}>
                  {/* Dropdowns and filters for searching vehicles */}
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
            {/* Results table */}
            <div className={styles.results}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.thStock}>Stock Number</th>
                    <th className={styles.th}>Make</th>
                    <th className={styles.th}>Model</th>
                    <th className={styles.th}>Year</th>
                    <th className={styles.th}>Milage</th>
                    <th className={styles.th}>&emsp;&emsp;&emsp;&nbsp;VIN</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className={styles.td}>{vehicle.stock_number}</td>
                      <td className={styles.td}>{vehicle.make}</td>
                      <td className={styles.td}>{vehicle.model}</td>
                      <td className={styles.td}>{vehicle.year}</td>
                      <td className={styles.td}>{vehicle.milage}</td>
                      <td className={styles.td}>{vehicle.vin}</td>
                      <td className={styles.td}>
                        {formatPrice(vehicle.purchase_price)}
                      </td>
                      <td className={styles.td}>
                        {/* Edit button */}
                        <button
                          className={styles.btnEdit}
                          onClick={() => handleEdit(vehicle.id)}
                          title="Edit"
                        >
                          <img
                            src="./icons/edit.svg"
                            className={styles.editIcon}
                            alt="edit"
                          ></img>
                        </button>
                        {/* Delete button */}
                        <button
                          className={styles.btnDelete}
                          onClick={() => handleDelete(vehicle.id)}
                          title="Delete"
                        >
                          <img
                            src="./icons/delete.svg"
                            className={styles.deleteIcon}
                            alt="Delete"
                          ></img>
                        </button>
                      </td>
                    </tr>
                  ))}
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
