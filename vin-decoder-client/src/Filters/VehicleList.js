import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VehicleList.css';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);

    // useEffect hook to fetch vehicles from the server when the component mounts
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                // Send GET request to the server to fetch vehicle data
                const response = await axios.get('http://localhost:5000/vehicles');
                // Update the state with the fetched vehicle data
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };
        fetchVehicles();
    }, []);

    return (
        <div className="vehicle-list-container">
            <h1>Vehicle List</h1>
            {/* Map through the vehicles array and display each vehicle's details */}
            {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-item">
                    <h2>{vehicle.make} {vehicle.model} - {vehicle.year}</h2>
                    {/* Conditionally render the vehicle photo if the URL is available */}
                    {vehicle.photo_url && (
                        <img src={vehicle.photo_url} alt={`${vehicle.make} ${vehicle.model}`} className="vehicle-photo" />
                    )}
                    {/* Display various details of the vehicle */}
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
    );
};

export default VehicleList;
