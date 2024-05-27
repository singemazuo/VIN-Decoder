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
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default VinForm;
