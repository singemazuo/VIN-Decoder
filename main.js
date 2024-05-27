const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/decode_vin', async (req, res) => {
    const vin = req.body.vin;
    try {
        const result = await decodeVin(vin);
        console.log('VIN Decode Result:', result);  
        res.json(result);
    } catch (error) {
        console.error('Error decoding VIN:', error);  
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/decode_vin_batch', async (req, res) => {
    const vins = req.body.vins;
    try {
        const result = await decodeVinBatch(vins);
        console.log('Batch VIN Decode Result:', result); 
        res.json(result);
    } catch (error) {
        console.error('Error decoding VIN batch:', error);  
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/submit_vehicle', upload.array('photos'), async (req, res) => {
    const vin = req.body.vin;
    const fields = JSON.parse(req.body.fields);
    const photos = req.files;

    try {
        // Process the fields and photos as needed
        console.log('VIN:', vin);
        console.log('Fields:', fields);
        console.log('Photos:', photos);
        // Save the data to your database or perform other actions

        res.json({ message: 'Vehicle data submitted successfully' });
    } catch (error) {
        console.error('Error submitting vehicle data:', error);
        res.status(500).json({ error: error.toString() });
    }
});

const decodeVin = async (vin) => {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    try {
        const response = await axios.get(url);
        console.log('NHTSA API Response:', response.data);

        if (response.data && response.data.Results) {
            const results = response.data.Results;
            const mappedResult = {
                Year: findValue(results, 'Model Year'),
                Make: findValue(results, 'Make'),
                Model: findValue(results, 'Model'),
                Transmission: findValue(results, 'Transmission Style'),
                ExteriorColor: findValue(results, 'Exterior Color'),
                InteriorColor: findValue(results, 'Interior Color'),
                EngineBrake: findValue(results, 'Engine Brake (hp) From'),
                Weight: findValue(results, 'Gross Vehicle Weight Rating From'),
                Engine: findValue(results, 'Engine Model'),
                Doors: findValue(results, 'Doors'),
                StockNumber: findValue(results, 'Stock Number'),
                Fuel: findValue(results, 'Primary Fuel Type'),
                Title: findValue(results, 'Vehicle Type'),
                VIN: vin,
                Airbags: {
                    Front: findValue(results, 'Front Air Bag Locations'),
                    Knee: findValue(results, 'Knee Air Bag Locations'),
                    Side: findValue(results, 'Side Air Bag Locations'),
                    Curtain: findValue(results, 'Curtain Air Bag Locations'),
                    SeatCushion: findValue(results, 'Seat Cushion Air Bag Locations'),
                    OtherRestraintInfo: findValue(results, 'Other Restraint System Info'),
                },
                PlantInfo: findValue(results, 'Plant Company Name') + ", " +
                           findValue(results, 'Plant City') + ", " +
                           findValue(results, 'Plant State') + ", " +
                           findValue(results, 'Plant Country')
            };
            return mappedResult;
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error in decodeVin:', error);
        throw error;
    }
};

const findValue = (results, variable) => {
    const result = results.find(item => item.Variable === variable);
    return result ? result.Value : 'N/A';
};

const decodeVinBatch = async (vins) => {
    const url = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/";
    const data = {
        format: "json",
        data: vins.join(';')
    };
    const response = await axios.post(url, data);
    console.log('NHTSA API Batch Response:', response.data);  
    return response.data;
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
