import React, { useState } from 'react';
import axios from 'axios';
import './VinForm.css';

const VinForm = () => {
    const [vin, setVin] = useState('');
    const [result, setResult] = useState(null);
    const [logoUrl, setLogoUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/decode_vin', { vin });
            console.log('API Response:', response.data);
            setResult(response.data);
            fetchLogo(response.data.Make);
        } catch (error) {
            console.error('Error decoding VIN:', error);
            setResult({ error: 'Error decoding VIN' });
        }
    };

    const fetchLogo = async (make) => {
        try {
            const logoResponse = await axios.get(`https://logo.clearbit.com/${make}.com`);
            setLogoUrl(logoResponse.config.url);
        } catch (error) {
            console.error('Error fetching logo:', error);
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
                        <div>
                            {logoUrl && <img src={logoUrl} alt={`${result.Make} logo`} className="car-logo" />}
                            <ul className="vin-details">
                                <li><strong>Year:</strong> {result.Year}</li>
                                <li><strong>Make:</strong> {result.Make}</li>
                                <li><strong>Model:</strong> {result.Model}</li>
                                <li><strong>Transmission:</strong> {result.Transmission}</li>
                                <li><strong>Weight:</strong> {result.Weight}</li>
                                <li><strong>Exterior Color:</strong> {result.ExteriorColor}</li>
                                <li><strong>Interior Color:</strong> {result.InteriorColor}</li>
                                <li><strong>Engine:</strong> {result.Engine}</li>
                                <li><strong>Doors:</strong> {result.Doors}</li>
                                <li><strong>Stock Number:</strong> {result.StockNumber}</li>
                                <li><strong>Fuel:</strong> {result.Fuel}</li>
                                <li><strong>Title:</strong> {result.Title}</li>
                                <li><strong>VIN:</strong> {result.VIN}</li>
                            </ul>
                            <h4>Airbags:</h4>
                            <ul className="vin-details">
                                <li><strong>Front:</strong> {result.Airbags.Front}</li>
                                <li><strong>Knee:</strong> {result.Airbags.Knee}</li>
                                <li><strong>Side:</strong> {result.Airbags.Side}</li>
                                <li><strong>Curtain:</strong> {result.Airbags.Curtain}</li>
                                <li><strong>Seat Cushion:</strong> {result.Airbags.SeatCushion}</li>
                                <li><strong>Other Restraint Info:</strong> {result.Airbags.OtherRestraintInfo}</li>
                            </ul>
                            <h4>Plant Information:</h4>
                            <p>{result.PlantInfo}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VinForm;
