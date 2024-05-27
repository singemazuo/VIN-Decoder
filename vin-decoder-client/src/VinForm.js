import React, { useState } from 'react';
import axios from 'axios';

const VinForm = () => {
    const [vin, setVin] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/decode_vin', { vin });
            console.log('API Response:', response.data);
            setResult(response.data);
        } catch (error) {
            console.error('Error decoding VIN:', error);
            setResult({ error: 'Error decoding VIN' });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter VIN:
                    <input
                        type="text"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Decode VIN</button>
            </form>
            {result && (
                <div>
                    <h3>Decoded VIN Information:</h3>
                    {result.error ? (
                        <p>{result.error}</p>
                    ) : (
                        <ul>
                            <li>Year: {result.Year}</li>
                            <li>Make: {result.Make}</li>
                            <li>Model: {result.Model}</li>
                            <li>Transmission: {result.Transmission}</li>
                            <li>Exterior Color: {result.ExteriorColor}</li>
                            <li>Interior Color: {result.InteriorColor}</li>
                            <li>Engine: {result.Engine}</li>
                            <li>Doors: {result.Doors}</li>
                            <li>Stock Number: {result.StockNumber}</li>
                            <li>Fuel: {result.Fuel}</li>
                            <li>Title: {result.Title}</li>
                            <li>VIN: {result.VIN}</li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default VinForm;
