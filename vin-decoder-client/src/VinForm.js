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
                            <div className="form-group">
                                <label>Year:</label>
                                <input type="text" value={fields.Year} />
                            </div>
                            <div className="form-group">
                                <label>Make:</label>
                                <input type="text" value={fields.Make} />
                            </div>
                            <div className="form-group">
                                <label>Model:</label>
                                <input type="text" value={fields.Model} />
                            </div>
                            <div className="form-group">
                                <label>Transmission:</label>
                                <input type="text" value={fields.Transmission} />
                            </div>
                            <div className="form-group">
                                <label>Weight:</label>
                                <input type="text" value={fields.Weight} />
                            </div>
                            <div className="form-group">
                                <label>Exterior Color:</label>
                                <input type="text" value={fields.ExteriorColor} />
                            </div>
                            <div className="form-group">
                                <label>Interior Color:</label>
                                <input type="text" value={fields.InteriorColor} />
                            </div>
                            <div className="form-group">
                                <label>Engine Brake:</label>
                                <input type="text" value={fields.EngineBrake} />
                            </div>
                            <div className="form-group">
                                <label>Engine:</label>
                                <input type="text" value={fields.Engine} />
                            </div>
                            <div className="form-group">
                                <label>Doors:</label>
                                <input type="text" value={fields.Doors} />
                            </div>
                            <div className="form-group">
                                <label>Stock Number:</label>
                                <input type="text" value={fields.StockNumber} />
                            </div>
                            <div className="form-group">
                                <label>Fuel:</label>
                                <input type="text" value={fields.Fuel} />
                            </div>
                            <div className="form-group">
                                <label>Title:</label>
                                <input type="text" value={fields.Title} />
                            </div>
                            <div className="form-group">
                                <label>Front Airbags:</label>
                                <input type="text" value={fields.FrontAirbags} />
                            </div>
                            <div className="form-group">
                                <label>Knee Airbags:</label>
                                <input type="text" value={fields.KneeAirbags} />
                            </div>
                            <div className="form-group">
                                <label>Side Airbags:</label>
                                <input type="text" value={fields.SideAirbags} />
                            </div>
                            <div className="form-group">
                                <label>Curtain Airbags:</label>
                                <input type="text" value={fields.CurtainAirbags} />
                            </div>
                            <div className="form-group">
                                <label>Seat Cushion Airbags:</label>
                                <input type="text" value={fields.SeatCushionAirbags} />
                            </div>
                            <div className="form-group">
                                <label>Other Restraint Info:</label>
                                <input type="text" value={fields.OtherRestraintInfo} />
                            </div>
                            <div className="form-group">
                                <label>Plant Information:</label>
                                <input type="text" value={fields.PlantInfo} />
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VinForm;
