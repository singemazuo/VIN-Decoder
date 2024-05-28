const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const upload = multer({ dest: process.env.PHOTO_STORAGE_PATH });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

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

app.post('/submit_vehicle', upload.array('photos'), async (req, res) => {
    const {
        vin, year, make, model, transmission, weight,
        exteriorColor, interiorColor, engineBrake, engine,
        doors, stockNumber, fuel, title, frontAirbags, kneeAirbags,
        sideAirbags, curtainAirbags, seatCushionAirbags, otherRestraintInfo, plantInfo
    } = req.body;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const vehicleQueryText = `
                INSERT INTO vehicles(
                    vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id`;
            const vehicleValues = [vin, year, make, model, transmission, weight, exteriorColor, interiorColor, engineBrake, engine, doors, stockNumber, fuel, title, frontAirbags, kneeAirbags, sideAirbags, curtainAirbags, seatCushionAirbags, otherRestraintInfo, plantInfo];
            const vehicleResult = await client.query(vehicleQueryText, vehicleValues);
            const vehicleId = vehicleResult.rows[0].id;

            const photoInsertPromises = req.files.map(file => {
                const photoQueryText = 'INSERT INTO photos(vehicle_id, photo_url) VALUES($1, $2)';
                const photoValues = [vehicleId, path.join(process.env.PHOTO_STORAGE_PATH, file.filename)];
                return client.query(photoQueryText, photoValues);
            });

            await Promise.all(photoInsertPromises);

            await client.query('COMMIT');
            res.json({ message: 'Vehicle data and photos submitted successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error submitting vehicle data:', error);
            res.status(500).json({ error: error.message });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to list all vehicles
app.get('/vehicles', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN photos p ON v.id = p.vehicle_id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to search vehicles
app.get('/search_vehicles', async (req, res) => {
    const { make, model, year } = req.query;
    try {
        const result = await pool.query(`
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN photos p ON v.id = p.vehicle_id
            WHERE ($1::text IS NULL OR v.make ILIKE $1)
            AND ($2::text IS NULL OR v.model ILIKE $2)
            AND ($3::int IS NULL OR v.year = $3)
        `, [make ? `%${make}%` : null, model ? `%${model}%` : null, year ? parseInt(year) : null]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching vehicles:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/vehicle/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM photos WHERE vehicle_id = $1', [id]);
            await client.query('DELETE FROM vehicles WHERE id = $1', [id]);
            await client.query('COMMIT');
            res.json({ message: 'Vehicle deleted successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting vehicle:', error);
            res.status(500).json({ error: error.message });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register endpoint


// Login endpoint


// Middleware to protect routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));