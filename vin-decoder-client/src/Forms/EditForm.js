import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './EditForm.module.css';
import Sidebar from '../Navigation/Sidebar';
import PhotoUpload from './PhotoUpload';

const EditForm = () => {
    // State variables to manage the form data and component state
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
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Effect to fetch vehicle data when the component is mounted or the location changes
    useEffect(() => {
        const fetchVehicle = async (id) => {
            try {
                const response = await axios.get(`http://localhost:5000/vehicle/${id}`);
                const vehicle = response.data;
                setVin(vehicle.vin);
                setFields({
                    Year: vehicle.year || '',
                    Make: vehicle.make || '',
                    Model: vehicle.model || '',
                    Transmission: vehicle.transmission || '',
                    Weight: vehicle.weight || '',
                    ExteriorColor: vehicle.exterior_color || '',
                    InteriorColor: vehicle.interior_color || '',
                    EngineBrake: vehicle.engine_brake || '',
                    Engine: vehicle.engine || '',
                    Doors: vehicle.doors || '',
                    StockNumber: vehicle.stock_number || '',
                    Fuel: vehicle.fuel || '',
                    Title: vehicle.title || '',
                    FrontAirbags: vehicle.front_airbags || '',
                    KneeAirbags: vehicle.knee_airbags || '',
                    SideAirbags: vehicle.side_airbags || '',
                    CurtainAirbags: vehicle.curtain_airbags || '',
                    SeatCushionAirbags: vehicle.seat_cushion_airbags || '',
                    OtherRestraintInfo: vehicle.other_restraint_info || '',
                    PlantInfo: vehicle.plant_info || ''
                });
                setShowForm(true);
                setPhotos(vehicle.photos || []);
                if (vehicle.make) {
                    fetchLogo(vehicle.make);
                }
            } catch (error) {
                console.error('Error fetching vehicle:', error);
            }
        };

        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id) {
            fetchVehicle(id);
        }
    }, [location]);

    // Handle form submission to update vehicle data
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('vin', vin);
        formData.append('year', fields.Year);
        formData.append('make', fields.Make);
        formData.append('model', fields.Model);
        formData.append('transmission', fields.Transmission);
        formData.append('weight', fields.Weight);
        formData.append('exteriorColor', fields.ExteriorColor);
        formData.append('interiorColor', fields.InteriorColor);
        formData.append('engineBrake', fields.EngineBrake);
        formData.append('engine', fields.Engine);
        formData.append('doors', fields.Doors);
        formData.append('stockNumber', fields.StockNumber);
        formData.append('fuel', fields.Fuel);
        formData.append('title', fields.Title);
        formData.append('frontAirbags', fields.FrontAirbags);
        formData.append('kneeAirbags', fields.KneeAirbags);
        formData.append('sideAirbags', fields.SideAirbags);
        formData.append('curtainAirbags', fields.CurtainAirbags);
        formData.append('seatCushionAirbags', fields.SeatCushionAirbags);
        formData.append('otherRestraintInfo', fields.OtherRestraintInfo);
        formData.append('plantInfo', fields.PlantInfo);

        photos.forEach((photo, index) => {
            formData.append(`photos`, photo);
        });

        try {
            const params = new URLSearchParams(location.search);
            const id = params.get('id');
            const response = await axios.put(`http://localhost:5000/vehicle/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Submit Response:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error submitting vehicle data:', error);
        }
    };

    // Fetch logo for the given make
    const fetchLogo = async (make) => {
        try {
            console.log('Fetching logo for make:', make);
            const formattedMake = make.toLowerCase();
            const logoResponse = await axios.get(`https://logo.clearbit.com/${formattedMake}.com`);
            setLogoUrl(logoResponse.config.url);
        } catch (error) {
            console.error('Error fetching logo for make:', make, error);
            setLogoUrl('/path/to/placeholder/logo.png');
        }
    };

    // Handle changes in form fields
    const handleFieldChange = (field, value) => {
        setFields({
            ...fields,
            [field]: value
        });
    };

    // Handle changes in photos
    const handlePhotosChange = (photos) => {
        setPhotos(photos);
    };

    return (
        <div className={styles.vinContainer}>
            {/* Sidebar component */}
            <Sidebar />

            {/* Show form only if the data is loaded */}
            {showForm && (
                <div className={styles.formContainer}>
                    {/* Display logo and vehicle details */}
                    <div className={styles.logoAndDetails}>
                        {logoUrl && <img src={logoUrl} alt={`${fields.Make} logo`} className={styles.carLogo} />}
                        <div className={styles.detailsText}>
                            {fields.Year} {fields.Make} {fields.Model}
                        </div>
                    </div>
                    {/* Form for editing vehicle details */}
                    <form onSubmit={handleFormSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Year:</label>
                            <input
                                type="text"
                                value={fields.Year}
                                onChange={(e) => handleFieldChange('Year', e.target.value)}
                                required
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Make:</label>
                            <input
                                type="text"
                                value={fields.Make}
                                onChange={(e) => handleFieldChange('Make', e.target.value)}
                                required
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Model:</label>
                            <input
                                type="text"
                                value={fields.Model}
                                onChange={(e) => handleFieldChange('Model', e.target.value)}
                                required
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Transmission:</label>
                            <input
                                type="text"
                                value={fields.Transmission}
                                onChange={(e) => handleFieldChange('Transmission', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Weight:</label>
                            <input
                                type="text"
                                value={fields.Weight}
                                onChange={(e) => handleFieldChange('Weight', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Exterior Color:</label>
                            <input
                                type="text"
                                value={fields.ExteriorColor}
                                onChange={(e) => handleFieldChange('ExteriorColor', e.target.value)}
                                required
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Interior Color:</label>
                            <input
                                type="text"
                                value={fields.InteriorColor}
                                onChange={(e) => handleFieldChange('InteriorColor', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Engine Brake:</label>
                            <input
                                type="text"
                                value={fields.EngineBrake}
                                onChange={(e) => handleFieldChange('EngineBrake', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Engine:</label>
                            <input
                                type="text"
                                value={fields.Engine}
                                onChange={(e) => handleFieldChange('Engine', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Doors:</label>
                            <input
                                type="text"
                                value={fields.Doors}
                                onChange={(e) => handleFieldChange('Doors', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Stock Number:</label>
                            <input
                                type="text"
                                value={fields.StockNumber}
                                onChange={(e) => handleFieldChange('StockNumber', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Fuel:</label>
                            <input
                                type="text"
                                value={fields.Fuel}
                                onChange={(e) => handleFieldChange('Fuel', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Title:</label>
                            <input
                                type="text"
                                value={fields.Title}
                                onChange={(e) => handleFieldChange('Title', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Front Airbags:</label>
                            <input
                                type="text"
                                value={fields.FrontAirbags}
                                onChange={(e) => handleFieldChange('FrontAirbags', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Knee Airbags:</label>
                            <input
                                type="text"
                                value={fields.KneeAirbags}
                                onChange={(e) => handleFieldChange('KneeAirbags', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Side Airbags:</label>
                            <input
                                type="text"
                                value={fields.SideAirbags}
                                onChange={(e) => handleFieldChange('SideAirbags', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Curtain Airbags:</label>
                            <input
                                type="text"
                                value={fields.CurtainAirbags}
                                onChange={(e) => handleFieldChange('CurtainAirbags', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Seat Cushion Airbags:</label>
                            <input
                                type="text"
                                value={fields.SeatCushionAirbags}
                                onChange={(e) => handleFieldChange('SeatCushionAirbags', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Other Restraint Info:</label>
                            <input
                                type="text"
                                value={fields.OtherRestraintInfo}
                                onChange={(e) => handleFieldChange('OtherRestraintInfo', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabels}>Plant Information:</label>
                            <input
                                type="text"
                                value={fields.PlantInfo}
                                onChange={(e) => handleFieldChange('PlantInfo', e.target.value)}
                                className={styles.formInputBox}
                            />
                        </div>
                        <hr />
                        {/* PhotoUpload component to handle photo uploads */}
                        <PhotoUpload onPhotosChange={handlePhotosChange} />
                        <div className={styles.buttonWrapper}>
                        <button type="submit" className={styles.button6}>Submit Vehicle Data</button>

                        </div>
                    </form>
                </div>
            )}
            {result && result.error && (
                <div>
                    <p>{result.error}</p>
                </div>
            )}
        </div>
    );
};

export default EditForm;
