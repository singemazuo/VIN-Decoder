import React, { useState } from 'react';
import axios from 'axios';
import styles from './HomePage.module.css';
import NavigationBar from './NavigationBar';
import CarMakeDropdown from './CarMakeDropdown';
import YearDropdown from './YearDropdown';

const HomePage = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [buttonText, setButtonText] = useState('Search All');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/search_vehicles', {
                params: {
                    make: make || null,
                    model: model || null,
                    year: year || null
                }
            });
            setVehicles(response.data);
        } catch (error) {
            console.error('Error searching vehicles:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/vehicle/${id}`);
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    return (
        <div className={styles.container}>
            <NavigationBar />
            <div className={styles.homePage}>
                <h1>Search Vehicles</h1>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.searchContainer}>
                        <CarMakeDropdown make={make} setMake={setMake} model={model} setModel={setModel} className={styles.makeModelDropdown} />
                        <YearDropdown year={year} setYear={setYear} className={styles.yearDropdown} />
                    </div>
                    <button type="submit" className={styles.button6}>{buttonText}</button>
                </form>
                <div className={styles.vehicleList}>
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className={styles.vehicleItem}>
                            <button onClick={() => handleDelete(vehicle.id)} className={styles.button6}>Delete</button>
                            <h2>{vehicle.make} {vehicle.model} - {vehicle.year}</h2>
                            {vehicle.photo_url && (
                                <img src={`http://localhost:5000${vehicle.photo_url}`} alt={`${vehicle.make} ${vehicle.model}`} className={styles.vehiclePhoto} />
                            )}
                            <p><strong>VIN:</strong> {vehicle.vin}</p>
                            <p><strong>Transmission:</strong> {vehicle.transmission}</p>
                            <p><strong>Weight:</strong> {vehicle.weight}</p>
                            <p><strong>Exterior Color:</strong> {vehicle.exterior_color}</p>
                            <p><strong>Interior Color:</strong> {vehicle.interior_color}</p>
                            <p><strong>Engine Brake:</strong> {vehicle.engine_brake}</p>
                            <p><strong>Engine:</strong> {vehicle.engine}</p>
                            <p><strong>Doors:</strong> {vehicle.doors}</p>
                            <p><strong>Stock Number:</strong> {vehicle.stock_number}</p>
                            <p><strong>Fuel:</strong> {vehicle.fuel}</p>
                            <p><strong>Title:</strong> {vehicle.title}</p>
                            <p><strong>Airbags:</strong> {vehicle.front_airbags}, {vehicle.knee_airbags}, {vehicle.side_airbags}, {vehicle.curtain_airbags}, {vehicle.seat_cushion_airbags}</p>
                            <p><strong>Other Restraint Info:</strong> {vehicle.other_restraint_info}</p>
                            <p><strong>Plant Information:</strong> {vehicle.plant_info}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
