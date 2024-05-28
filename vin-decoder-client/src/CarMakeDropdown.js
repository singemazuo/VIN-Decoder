import React from 'react';
import { carData } from './carData';

const CarMakeDropdown = ({ make, setMake, model, setModel }) => {
    const handleMakeChange = (e) => {
        setMake(e.target.value);
        setModel(''); // Reset the model when the make changes
    };

    return (
        <div>
            <select value={make} onChange={handleMakeChange}>
                <option value="">Select Make</option>
                {Object.keys(carData).map((make) => (
                    <option key={make} value={make}>{make}</option>
                ))}
            </select>

            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                <option value="">Select Model</option>
                {make && carData[make].map((model) => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>
        </div>
    );
};

export default CarMakeDropdown;
