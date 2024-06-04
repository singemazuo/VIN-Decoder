import React from 'react';
import { carData } from './carData';
import styles from './CarMakeDropdown.module.css';

const CarMakeDropdown = ({ make, setMake, model, setModel }) => {
    const handleMakeChange = (e) => {
        setMake(e.target.value);
        setModel(''); 
    };

    return (
        <div className={styles.container}>
            <select value={make} onChange={handleMakeChange} className={styles.select}>
                <option value="">Select Make</option>
                {Object.keys(carData).map((make) => (
                    <option key={make} value={make}>{make}</option>
                ))}
            </select>

            <select value={model} className={styles.select} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                <option value="">Select Model</option>
                {make && carData[make].map((model) => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>
        </div>
    );
};

export default CarMakeDropdown;
