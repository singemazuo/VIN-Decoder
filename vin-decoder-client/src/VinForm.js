import React, { useState } from 'react';
import axios from 'axios';
import './VinForm.css';
import PhotoUpload from './PhotoUpload';

const VinForm = () => {
    const [vin, setVin] = useState('');
    const [result, setResult] = useState(null);
    const [logoUrl, setLogoUrl] = useState('');
    const [photos, setPhotos] = useState([]);
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

    const handleFieldChange = (field, value) => {
        setFields({
            ...fields,
            [field]: value
        });
    };

    const handlePhotosChange = (photos) => {
        setPhotos(photos);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('vin', vin);
        formData.append('fields', JSON.stringify(fields));
        photos.forEach((photo, index) => {
            formData.append(`photo${index}`, photo);
        });

        try {
            const response = await axios.post('http://localhost:5000/submit_vehicle', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Submit Response:', response.data);
            // Handle success response
        } catch (error) {
            console.error('Error submitting vehicle data:', error);
            // Handle error response
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
                                <input 
                                    type="text" 
                                    value={fields.Year} 
                                    onChange={(e) => handleFieldChange('Year', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Make:</label>
                                <input 
                                    type="text" 
                                    value={fields.Make} 
                                    onChange={(e) => handleFieldChange('Make', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Model:</label>
                                <input 
                                    type="text" 
                                    value={fields.Model} 
                                    onChange={(e) => handleFieldChange('Model', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Transmission:</label>
                                <input 
                                    type="text" 
                                    value={fields.Transmission} 
                                    onChange={(e) => handleFieldChange('Transmission', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Weight:</label>
                                <input 
                                    type="text" 
                                    value={fields.Weight} 
                                    onChange={(e) => handleFieldChange('Weight', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Exterior Color:</label>
                                <input 
                                    type="text" 
                                    value={fields.ExteriorColor} 
                                    onChange={(e) => handleFieldChange('ExteriorColor', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Interior Color:</label>
                                <input 
                                    type="text" 
                                    value={fields.InteriorColor} 
                                    onChange={(e) => handleFieldChange('InteriorColor', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Engine Brake:</label>
                                <input 
                                    type="text" 
                                    value={fields.EngineBrake} 
                                    onChange={(e) => handleFieldChange('EngineBrake', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Engine:</label>
                                <input 
                                    type="text" 
                                    value={fields.Engine} 
                                    onChange={(e) => handleFieldChange('Engine', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Doors:</label>
                                <input 
                                    type="text" 
                                    value={fields.Doors} 
                                    onChange={(e) => handleFieldChange('Doors', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock Number:</label>
                                <input 
                                    type="text" 
                                    value={fields.StockNumber} 
                                    onChange={(e) => handleFieldChange('StockNumber', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Fuel:</label>
                                <input 
                                    type="text" 
                                    value={fields.Fuel} 
                                    onChange={(e) => handleFieldChange('Fuel', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Title:</label>
                                <input 
                                    type="text" 
                                    value={fields.Title} 
                                    onChange={(e) => handleFieldChange('Title', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Front Airbags:</label>
                                <input 
                                    type="text" 
                                    value={fields.FrontAirbags} 
                                    onChange={(e) => handleFieldChange('FrontAirbags', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Knee Airbags:</label>
                                <input 
                                    type="text" 
                                    value={fields.KneeAirbags} 
                                    onChange={(e) => handleFieldChange('KneeAirbags', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Side Airbags:</label>
                                <input 
                                    type="text" 
                                    value={fields.SideAirbags} 
                                    onChange={(e) => handleFieldChange('SideAirbags', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Curtain Airbags:</label>
                                <input 
                                    type="text" 
                                    value={fields.CurtainAirbags} 
                                    onChange={(e) => handleFieldChange('CurtainAirbags', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Seat Cushion Airbags:</label>
                                <input 
                                    type="text" 
                                    value={fields.SeatCushionAirbags} 
                                    onChange={(e) => handleFieldChange('SeatCushionAirbags', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Other Restraint Info:</label>
                                <input 
                                    type="text" 
                                    value={fields.OtherRestraintInfo} 
                                    onChange={(e) => handleFieldChange('OtherRestraintInfo', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Plant Information:</label>
                                <input 
                                    type="text" 
                                    value={fields.PlantInfo} 
                                    onChange={(e) => handleFieldChange('PlantInfo', e.target.value)} 
                                />
                            </div>
                            <hr></hr>
                            <PhotoUpload onPhotosChange={handlePhotosChange} />
                            <button onClick={handleFormSubmit}>Submit Vehicle Data</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VinForm;
