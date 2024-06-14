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


/////////////////////
///  VIN Decoder  ///
/////////////////////

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

/////////////////////
///  Add Vehicle  ///
/////////////////////

app.post('/submit_vehicle', upload.array('photos'), async (req, res) => {
    const {
        vin, year, make, model, transmission, weight,
        exteriorColor, interiorColor, engineBrake, engine,
        doors, stockNumber, fuel, title, frontAirbags, kneeAirbags,
        sideAirbags, curtainAirbags, seatCushionAirbags, otherRestraintInfo, 
        plantInfo, purchasePrice, salePrice, milage
    } = req.body;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const vehicleQueryText = `
                INSERT INTO vehicles(
                    vin, year, make, model, transmission, weight, exterior_color, interior_color, 
                    engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, 
                    side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info,
                    purchase_price, is_sold, milage
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING id`;
            const vehicleValues = [
                vin, year, make, model, transmission, weight, exteriorColor, interiorColor, engineBrake, 
                engine, doors, stockNumber, fuel, title, frontAirbags, kneeAirbags, sideAirbags, curtainAirbags, 
                seatCushionAirbags, otherRestraintInfo, plantInfo, purchasePrice, false, milage
            ];
            const vehicleResult = await client.query(vehicleQueryText, vehicleValues);
            const vehicleId = vehicleResult.rows[0].id;

            const photoInsertPromises = req.files.map(file => {
                const photoQueryText = 'INSERT INTO photos(vehicle_id, photo_url) VALUES($1, $2)';
                const photoValues = [vehicleId, `/uploads/${file.filename}`];
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


////////////////////////
///  Vehicle Search  ///
////////////////////////

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

//////////////////////////
///  Get All Vehicles  ///
//////////////////////////

app.get('/vehicles', async (req, res) => {
    const { sortColumn = 'make', sortOrder = 'asc' } = req.query;
    try {
        const result = await pool.query(`
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN photos p ON v.id = p.vehicle_id
            ORDER BY ${sortColumn} ${sortOrder}
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: error.message });
    }
});

/////////////////////////////
///  Get Unsold Vehicles  ///
/////////////////////////////

app.get('/unsold-vehicles', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN photos p ON v.id = p.vehicle_id
            WHERE v.is_sold = false
            ORDER BY v.make, v.model, v.year
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching unsold vehicles:', error);
        res.status(500).json({ error: error.message });
    }
});

///////////////////////////
///  Get Sold Vehicles  ///
///////////////////////////

app.get('/sold-vehicles', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, p.photo_url
            FROM vehicles v
            LEFT JOIN photos p ON v.id = p.vehicle_id
            WHERE v.is_sold = true
            ORDER BY v.make, v.model, v.year
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching unsold vehicles:', error);
        res.status(500).json({ error: error.message });
    }
});

////////////////////////
///  Update Vehicle  ///
////////////////////////

app.put('/vehicle/:id', upload.array('photos'), async (req, res) => {
    const { id } = req.params;
    const {
        vin, year, make, model, transmission, weight,
        exteriorColor, interiorColor, engineBrake, engine,
        doors, stockNumber, fuel, title, frontAirbags, kneeAirbags,
        sideAirbags, curtainAirbags, seatCushionAirbags, otherRestraintInfo, 
        plantInfo, purchasePrice, salePirce
    } = req.body;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const vehicleQueryText = `
                UPDATE vehicles SET
                    vin = $1, year = $2, make = $3, model = $4, transmission = $5, weight = $6, exterior_color = $7, interior_color = $8, engine_brake = $9, engine = $10, doors = $11, stock_number = $12, fuel = $13, title = $14, front_airbags = $15, knee_airbags = $16, side_airbags = $17, curtain_airbags = $18, seat_cushion_airbags = $19, other_restraint_info = $20, plant_info = $21, purchase_price = $22, sale_price = $23
                WHERE id = $24`;
            const vehicleValues = [vin, year, make, model, transmission, weight, exteriorColor, interiorColor, engineBrake, engine, doors, stockNumber, fuel, title, frontAirbags, kneeAirbags, sideAirbags, curtainAirbags, seatCushionAirbags, otherRestraintInfo, plantInfo, purchasePrice, salePirce, id];
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

////////////////////////
///  Delete Vehicle  ///
////////////////////////

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
        const result = await pool.query('SELECT * FROM customers ORDER BY lastName ASC');
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

//////////////////////////////////
///  Get Sales Data (Monthly)  ///
//////////////////////////////////

app.get('/revenue_data', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM sale_date) AS month,
                SUM(sale_price) AS revenue
            FROM vehicles 
            WHERE sale_date >= NOW() - INTERVAL '1 year' 
            GROUP BY EXTRACT(MONTH FROM sale_date) 
            ORDER BY month;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: error.message });
    }
});

////////////////////////////
///  Get Monthly Profit  ///
////////////////////////////

app.get('/profit_data', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM sale_date) AS month,
                SUM(sale_price - purchase_price) AS profit 
            FROM vehicles 
            WHERE sale_date >= NOW() - INTERVAL '1 year' 
            GROUP BY EXTRACT(MONTH FROM sale_date) 
            ORDER BY month;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: error.message });
    }
});

////////////////////////////
///  Get Average profit  ///
////////////////////////////

app.get('/get_average_profit', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT ROUND(AVG(sale_price - purchase_price), 2) AS average_profit
            FROM vehicles
            WHERE sale_date > NOW() - INTERVAL '1 year' AND is_sold = true;
        `);
        const averageProfit = result.rows[0].average_profit;
        res.json({ average_profit: averageProfit });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message });
    }
});

////////////////////////////
///  Get Average profit  ///
////////////////////////////

app.get('/get_average_sale', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT ROUND(AVG(sale_price), 2) AS average_sale
            FROM vehicles
            WHERE sale_date > NOW() - INTERVAL '1 year' AND is_sold = true;
        `);
        const averageSale = result.rows[0].average_sale;
        res.json({ average_sale: averageSale });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message });
    }
});

/////////////////////////////
///  Get Average Revenue  ///
/////////////////////////////

app.get('/get_average_revenue', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT ROUND(AVG(sale_price), 2) AS average_revenue
            FROM vehicles
            WHERE sale_date > NOW() - INTERVAL '1 year' AND is_sold = true;
        `);
        const averageRevenue = result.rows[0].average_revenue;
        res.json({ average_revenue: averageRevenue });
    } catch (error) {
        console.error('Error fetching average revenue:', error);
        res.status(500).json({ error: error.message });
    }
});

/////////////////////
///  Get Orders   ///
/////////////////////

app.get('/get_orders', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.id, 
                o.sale_price, 
                o.sale_date,
                c.firstname AS customer_firstname,
                c.lastname AS customer_lastname,
                v.make AS vehicle_make,
                v.model AS vehicle_model,
                v.year AS vehicle_year,
                v.vin AS vehicle_vin
            FROM Orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN vehicles v ON o.vehicle_id = v.id
            ORDER BY o.sale_date ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});


////////////////////////////////
///  Get Sales Data (Count)  ///
////////////////////////////////

app.get('/vehicles_sold_past_year', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT COUNT(*) 
            FROM vehicles 
            WHERE sale_date > current_date - interval '1 year' 
            AND is_sold = TRUE
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching vehicles sold in the past year:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

////////////////////////////////
///  Get Vehcile Make Data   ///
////////////////////////////////

app.get('/vehicle-make-distribution', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT LOWER(make) AS make, COUNT(*) AS count
            FROM vehicles
            GROUP BY LOWER(make);
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vehicle make distribution:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/////////////////////////////////////
///  Get Vehcile Sold This Month  ///
/////////////////////////////////////

app.get('/vehicles-sold-this-month', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT COUNT(*) AS count
            FROM vehicles
            WHERE date_trunc('month', sale_date) = date_trunc('month', current_date);
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching vehicles sold this month:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

////////////////////////////////////
///  Monthly Vehicle Difference  ///
////////////////////////////////////

app.get('/vehicle-sales-difference', async (req, res) => {
    try {
        const result = await pool.query(`
            WITH current_month AS (
                SELECT COUNT(*) AS sold_this_month
                FROM vehicles
                WHERE is_sold = TRUE
                  AND sale_date >= date_trunc('month', current_date)
                  AND sale_date < date_trunc('month', current_date + interval '1 month')
            ),
            previous_month AS (
                SELECT COUNT(*) AS sold_last_month
                FROM vehicles
                WHERE is_sold = TRUE
                  AND sale_date >= date_trunc('month', current_date - interval '1 month')
                  AND sale_date < date_trunc('month', current_date)
            )
            SELECT 
                cm.sold_this_month,
                pm.sold_last_month,
                (cm.sold_this_month - pm.sold_last_month) AS difference,
                CASE 
                    WHEN pm.sold_last_month = 0 THEN NULL
                    ELSE (cm.sold_this_month - pm.sold_last_month) / pm.sold_last_month::float * 100
                END AS percentage_difference
            FROM 
                current_month cm,
                previous_month pm;
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching vehicle sales difference:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//////////////////////
///  Create Order  ///
//////////////////////

app.post('/create-order', async (req, res) => {
    const { customerId, vehicleId, salePrice } = req.body;
    const saleDate = new Date();

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert the new order
            const orderQueryText = 'INSERT INTO orders (customer_id, vehicle_id, sale_price, sale_date) VALUES ($1, $2, $3, $4) RETURNING id';
            const orderValues = [customerId, vehicleId, salePrice, saleDate];
            const orderResult = await client.query(orderQueryText, orderValues);
            const orderId = orderResult.rows[0].id;

            // Update the customer's order count (assuming there's a column to store this)
            const customerUpdateQueryText = 'UPDATE customers SET total_orders = total_orders + 1 WHERE id = $1';
            await client.query(customerUpdateQueryText, [customerId]);

            // Update the vehicle's sale date and is_sold status
            const vehicleUpdateQueryText = 'UPDATE vehicles SET sale_date = $1, is_sold = TRUE WHERE id = $2';
            await client.query(vehicleUpdateQueryText, [saleDate, vehicleId]);

            await client.query('COMMIT');
            res.status(201).json({ orderId });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//////////////////////
///  Delete Order  ///
//////////////////////

app.delete('/delete_order/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Get the order details
            const orderResult = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
            const order = orderResult.rows[0];

            if (!order) {
                await client.query('ROLLBACK');
                res.status(404).json({ error: 'Order not found' });
                return;
            }

            // Update the vehicle
            await client.query('UPDATE vehicles SET is_sold = false, sale_date = NULL, sale_price = NULL WHERE id = $1', [order.vehicle_id]);

            // Update the customer
            await client.query('UPDATE customers SET total_orders = total_orders - 1 WHERE id = $1', [order.customer_id]);

            // Delete the order
            await client.query('DELETE FROM orders WHERE id = $1', [id]);

            await client.query('COMMIT');
            res.status(200).json({ message: 'Order deleted and changes reverted successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting order:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
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