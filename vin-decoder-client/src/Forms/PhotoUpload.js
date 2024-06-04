import React, { useState } from 'react';
import './PhotoUpload.css';

const PhotoUpload = ({ onPhotosChange }) => {
    const [photos, setPhotos] = useState([]);

    const handlePhotoChange = (event) => {
        const files = Array.from(event.target.files);
        const newPhotos = [...photos, ...files];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
    };

    const PhotoUpload = ({ onPhotosChange }) => {
        const handleFileChange = (e) => {
            const files = Array.from(e.target.files);
            onPhotosChange(files);
        };
    
        return (
            <div>
                <input type="file" multiple onChange={handleFileChange} />
            </div>
        );
    };

    return (
        <div className="photo-upload-container">
            <label htmlFor="photo-upload">Upload Vehicle Photos:</label>
            <br></br>
            <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
            />
            <div className="photo-preview">
                {photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                        <img src={URL.createObjectURL(photo)} alt={`Vehicle Photo ${index + 1}`} />
                        <button type="button" onClick={() => removePhoto(index)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoUpload;
