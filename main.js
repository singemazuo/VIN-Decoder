const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/decode_vin', async (req, res) => {
    const vin = req.body.vin;
    try {
        const result = await decodeVin(vin);
        console.log('VIN Decode Result:', result);  // Add this line
        res.json(result);
    } catch (error) {
        console.error('Error decoding VIN:', error);  // Add this line
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/decode_vin_batch', async (req, res) => {
    const vins = req.body.vins;
    try {
        const result = await decodeVinBatch(vins);
        console.log('Batch VIN Decode Result:', result);  // Add this line
        res.json(result);
    } catch (error) {
        console.error('Error decoding VIN batch:', error);  // Add this line
        res.status(500).json({ error: error.toString() });
    }
});

const decodeVin = async (vin) => {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.Results) {
            return response.data.Results; 
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error in decodeVin:', error);
        throw error;
    }
};


const decodeVinBatch = async (vins) => {
    const url = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/";
    const data = {
        format: "json",
        data: vins.join(';')
    };
    const response = await axios.post(url, data);
    console.log('NHTSA API Batch Response:', response.data);  // Add this line
    return response.data;
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
