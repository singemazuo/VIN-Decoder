import React, { useState } from 'react';
import axios from 'axios';
import './VinForm.css';

const VinForm = () => {
    const [vin, setVin] = useState('');
    const [result, setResult] = useState(null);
    const [logoUrl, setLogoUrl] = useState('');
    const [fields, setFields] = useState({
        Year: '',
        Make: '',
        Model: '',
        Transmission: '',
        Weight: '',
        ExteriorColor: '',
        InteriorColor: '',
        EngineBrake: '',
        Engine: '',
        Doors: '',
        StockNumber: '',
        Fuel: '',
        Title: '',
        FrontAirbags: '',
        KneeAirbags: '',
        SideAirbags: '',
        CurtainAirbags: '',
        SeatCushionAirbags: '',
        OtherRestraintInfo: '',
        PlantInfo: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/decode_vin', { vin });
            console.log('API Response:', response.data);
            setResult(response.data);
            fetchLogo(response.data.Make);

            setFields({
                Year: response.data.Year || '',
                Make: response.data.Make || '',
                Model: response.data.Model || '',
                Transmission: response.data.Transmission || '',
                Weight: response.data.Weight || '',
                ExteriorColor: response.data.ExteriorColor || '',
                InteriorColor: response.data.InteriorColor || '',
                EngineBrake: response.data.EngineBrake || '',
                Engine: response.data.Engine || '',
                Doors: response.data.Doors || '',
                StockNumber: response.data.StockNumber || '',
                Fuel: response.data.Fuel || '',
                Title: response.data.Title || '',
                FrontAirbags: response.data.Airbags.Front || '',
                KneeAirbags: response.data.Airbags.Knee || '',
                SideAirbags: response.data.Airbags.Side || '',
                CurtainAirbags: response.data.Airbags.Curtain || '',
                SeatCushionAirbags: response.data.Airbags.SeatCushion || '',
                OtherRestraintInfo: response.data.Airbags.OtherRestraintInfo || '',
                PlantInfo: response.data.PlantInfo || ''
            });
        } catch (error) {
            console.error('Error decoding VIN:', error);
            setResult({ error: 'Error decoding VIN' });
        }
    };

    const fetchLogo = async (make) => {
        try {
            const formattedMake = make.toLowerCase();
            const logoResponse = await axios.get(`https://logo.clearbit.com/${formattedMake}.com`);
            setLogoUrl(logoResponse.config.url);
        } catch (error) {
            console.error('Error fetching logo for make:', make, error);
            setLogoUrl('/path/to/placeholder/logo.png'); 
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>

                <br />
                <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    required
                    placeholder='Enter VIN here'
                />
                <button type="submit">Search VIN</button>
            </form>
            {result && (
                <div>
                    <hr />
                    {result.error ? (
                        <p>{result.error}</p>
                    ) : (
                        <div>
                            {logoUrl && <img src={logoUrl} alt={`${result.Make} logo`} className="car-logo" />}
                            <div className="vin-details">
                                <label>Year: <input type="text" value={fields.Year}  /></label><br />
                                <label>Make: <input type="text" value={fields.Make}  /></label><br />
                                <label>Model: <input type="text" value={fields.Model}  /></label><br />
                                <label>Transmission: <input type="text" value={fields.Transmission}  /></label><br />
                                <label>Weight: <input type="text" value={fields.Weight}  /></label><br />
                                <label>Exterior Color: <input type="text" value={fields.ExteriorColor}  /></label><br />
                                <label>Interior Color: <input type="text" value={fields.InteriorColor}  /></label><br />
                                <label>Engine Brake: <input type="text" value={fields.EngineBrake}  /></label><br />
                                <label>Engine: <input type="text" value={fields.Engine}  /></label><br />
                                <label>Doors: <input type="text" value={fields.Doors}  /></label><br />
                                <label>Stock Number: <input type="text" value={fields.StockNumber}  /></label><br />
                                <label>Fuel: <input type="text" value={fields.Fuel}  /></label><br />
                                <label>Title: <input type="text" value={fields.Title}  /></label><br />
                                <label>Front Airbags: <input type="text" value={fields.FrontAirbags}  /></label><br />
                                <label>Knee Airbags: <input type="text" value={fields.KneeAirbags}  /></label><br />
                                <label>Side Airbags: <input type="text" value={fields.SideAirbags}  /></label><br />
                                <label>Curtain Airbags: <input type="text" value={fields.CurtainAirbags}  /></label><br />
                                <label>Seat Cushion Airbags: <input type="text" value={fields.SeatCushionAirbags}  /></label><br />
                                <label>Other Restraint Info: <input type="text" value={fields.OtherRestraintInfo}  /></label><br />
                                <label>Plant Information: <input type="text" value={fields.PlantInfo}  /></label><br />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VinForm;
