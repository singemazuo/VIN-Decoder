import React, { useState } from 'react';
import './PhotoUpload.css';

const PhotoUpload = ({ onPhotosChange }) => {
    const [photos, setPhotos] = useState([]);

    // Handle the addition of new photos
    const handlePhotoChange = (event) => {
        const files = Array.from(event.target.files); // Convert file list to array
        const newPhotos = [...photos, ...files]; // Combine existing and new photos
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
    };

    // Remove a photo by its index
    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index); // Filter out the photo to be removed
        setPhotos(newPhotos); 
        onPhotosChange(newPhotos);
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
