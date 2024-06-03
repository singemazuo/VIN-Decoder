const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


const app = express();
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static('C:/var/www/vehicle-backend/uploads'));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.PHOTO_STORAGE_PATH);
    },
    filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${Date.now()}.jpeg`;
        cb(null, filename);
        req.savedFilePath = filename; 
    }
});

// Update multer upload initialization
const upload = multer({ storage: storage });


app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 
    }
}));

app.get('/protected', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ isAuthenticated: true, firstName: req.session.firstName });
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

////////////////////////
///  Vehicle Search  ///
////////////////////////

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
                const photoValues = [vehicleId, `/uploads/${file.filename}`]; // Construct the correct URL
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

app.get('/vehicle/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN photos p ON v.id = p.vehicle_id
            WHERE v.id = $1
        `, [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/vehicle/:id', upload.array('photos'), async (req, res) => {
    const { id } = req.params;
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
                UPDATE vehicles SET
                    vin = $1, year = $2, make = $3, model = $4, transmission = $5, weight = $6, exterior_color = $7, interior_color = $8, engine_brake = $9, engine = $10, doors = $11, stock_number = $12, fuel = $13, title = $14, front_airbags = $15, knee_airbags = $16, side_airbags = $17, curtain_airbags = $18, seat_cushion_airbags = $19, other_restraint_info = $20, plant_info = $21
                WHERE id = $22`;
            const vehicleValues = [vin, year, make, model, transmission, weight, exteriorColor, interiorColor, engineBrake, engine, doors, stockNumber, fuel, title, frontAirbags, kneeAirbags, sideAirbags, curtainAirbags, seatCushionAirbags, otherRestraintInfo, plantInfo, id];
            await client.query(vehicleQueryText, vehicleValues);

            await client.query('DELETE FROM photos WHERE vehicle_id = $1', [id]);
            const photoInsertPromises = req.files.map(file => {
                const photoQueryText = 'INSERT INTO photos(vehicle_id, photo_url) VALUES($1, $2)';
                const photoValues = [id, `/uploads/${file.filename}`];
                return client.query(photoQueryText, photoValues);
            });

            await Promise.all(photoInsertPromises);

            await client.query('COMMIT');
            res.json({ message: 'Vehicle data and photos updated successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating vehicle data:', error);
            res.status(500).json({ error: error.message });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: error.message });
    }
});


// Endpoint to search vehicles
app.get('/search_vehicles', async (req, res) => {
    const { make, model, year } = req.query;
    try {
        let query = `
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN (
                SELECT DISTINCT ON (vehicle_id) vehicle_id, photo_url
                FROM photos
                ORDER BY vehicle_id, id
            ) p ON v.id = p.vehicle_id
            WHERE 1=1
        `;

        const params = [];
        let paramIndex = 1;

        if (make) {
            query += ` AND v.make ILIKE $${paramIndex++}`;
            params.push(`%${make}%`);
        }
        if (model) {
            query += ` AND v.model ILIKE $${paramIndex++}`;
            params.push(`%${model}%`);
        }
        if (year) {
            query += ` AND v.year = $${paramIndex++}`;
            params.push(parseInt(year));
        }

        const result = await pool.query(query, params);
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


//////////////////////
///  Add Customer  ///
//////////////////////

app.post('/add-customer', async (req, res) => {
    const { firstname, lastname, email, address, phone,group } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO customers (firstname, lastname, email, address, phone, "group") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [firstname, lastname, email, address, phone,group]
        );
        res.status(201).json({ customerId: result.rows[0].id });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//////////////////////
///  Get Customer  ///
//////////////////////

app.get('/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/////////////////////////
///  Delete Customer  ///
/////////////////////////

app.delete('/customer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM customers WHERE id = $1', [id]);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

///////////////////////
///  Edit Customer  ///
///////////////////////

app.put('/customer/:id', async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, address, phone, group } = req.body;
    try {
        await pool.query(
            'UPDATE customers SET firstname = $1, lastname = $2, email = $3, address = $4, phone = $5, "group" = $6 WHERE id = $7',
            [firstname, lastname, email, address, phone, group, id]
        );
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


////////////////////////
///  Login / Logout  ///
////////////////////////

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            req.session.firstName = user.firstname;
            res.status(200).json({ isAuthenticated: true, firstName: user.firstname });
        } else {
            res.status(401).json({ isAuthenticated: false });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


///////////////////////////
///  User Registration  ///
///////////////////////////

// Register endpoint
app.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password, firstName, lastName) VALUES ($1, $2, $3, $4) RETURNING id',
            [email, hashedPassword, firstName, lastName]
        );
        res.status(201).json({ userId: result.rows[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).send('Unauthorized');
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));