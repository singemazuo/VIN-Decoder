import React from 'react';
import { carData } from './carData';  
import styles from './CarMakeDropdown.module.css';

// CarMakeDropdown component for selecting car make and model
const CarMakeDropdown = ({ make, setMake, model, setModel }) => {
    const handleMakeChange = (e) => {
        setMake(e.target.value);  
        setModel('');  
    };

    return (
        <div className={styles.container}>
            {/* Dropdown for selecting car make */}
            <select value={make} onChange={handleMakeChange} className={styles.select}>
                <option value="">Select Make</option>
                {/* Generate options for car makes */}
                {Object.keys(carData).map((make) => (
                    <option key={make} value={make}>{make}</option>
                ))}
            </select>

            {/* Dropdown for selecting car model */}
            <select value={model} className={styles.select} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                <option value="">Select Model</option>
                {/* Generate options for car models based on the selected make */}
                {make && carData[make].map((model) => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>
        </div>
    );
};

export default CarMakeDropdown;
