-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.session CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create the vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles
(
    id serial PRIMARY KEY,
    vin VARCHAR(100) NOT NULL UNIQUE,
    year INTEGER,
    make VARCHAR(100),
    model VARCHAR(100),
    transmission VARCHAR(100),
    weight VARCHAR(100),
    exterior_color VARCHAR(100),
    interior_color VARCHAR(100),
    engine_brake VARCHAR(100),
    engine VARCHAR(100),
    doors INTEGER,
    stock_number VARCHAR(100),
    fuel VARCHAR(100),
    title VARCHAR(100),
    front_airbags VARCHAR(150),
    knee_airbags VARCHAR(150),
    side_airbags VARCHAR(150),
    curtain_airbags VARCHAR(255),
    seat_cushion_airbags VARCHAR(255),
    other_restraint_info VARCHAR(255),
    plant_info VARCHAR(100),
    purchase_price NUMERIC,
    mileage INTEGER,
    sale_price NUMERIC,
    is_sold BOOLEAN DEFAULT false,
    sale_date DATE
);

ALTER TABLE IF EXISTS public.vehicles
    OWNER TO postgres;

-- Create the photos table
CREATE TABLE IF NOT EXISTS public.photos
(
    id serial PRIMARY KEY,
    vehicle_id INTEGER REFERENCES public.vehicles(id) ON DELETE CASCADE,
    photo_url TEXT
);

ALTER TABLE IF EXISTS public.photos
    OWNER TO postgres;

-- Create the session table
CREATE TABLE IF NOT EXISTS public.session
(
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);

ALTER TABLE IF EXISTS public.session
    OWNER TO postgres;

-- Create the users table
CREATE TABLE IF NOT EXISTS public.users
(
    id serial PRIMARY KEY,
    firstname VARCHAR(40) NOT NULL,
    lastname VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE IF EXISTS public.users
    OWNER TO postgres;

-- Create the customers table
CREATE TABLE IF NOT EXISTS public.customers
(
    id serial PRIMARY KEY,
    firstname VARCHAR(40) NOT NULL,
    lastname VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    "group" VARCHAR(100)
);

ALTER TABLE IF EXISTS public.customers
    OWNER TO postgres;

    -- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders
(
    id serial PRIMARY KEY,
    customer_id INTEGER REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES public.vehicles(id) ON DELETE CASCADE,
    sale_price NUMERIC,
    sale_date DATE
);

ALTER TABLE IF EXISTS public.orders
    OWNER TO postgres;

-- Insert 3 vehicles for June 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A876549', 2017, 'Subaru', 'Outback', 'Automatic', '1650kg', 'Green', 'Black', 'NA', '2.5L', 4, '876549', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Subaru Plant, Ota, Japan', 11000, 12250, TRUE, '2022-06-10', 84517),
('1HGCM82633A347472', 2018, 'Jeep', 'Cherokee', 'Automatic', '1800kg', 'White', 'Black', 'NA', '3.2L', 4, '347472', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Jeep Plant, Toledo, USA', 9900, 9995, TRUE, '2022-06-15', 32453),
('1HGCM82633A767685', 2019, 'Toyota', 'RAV4', 'Automatic', '1750kg', 'Black', 'Gray', 'NA', '2.5L', 4, '767685', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Woodstock, Canada', 14000, 16000, TRUE, '2022-06-20', 65425);

-- Insert 4 vehicles for July 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A457149', 2018, 'Ford', 'Escape', 'Automatic', '1600kg', 'Silver', 'Black', 'NA', '2.0L', 4, '457149', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Ford Plant, Louisville, USA', 11000, 13000, TRUE, '2022-07-10', 35000),
('1HGCM82633A123766', 2017, 'Honda', 'CR-V', 'Automatic', '1600kg', 'Blue', 'Gray', 'NA', '1.5L', 4, 'H12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Swindon, UK', 11500, 13500, TRUE, '2022-07-15', 36000),
('1HGCM82633A123411', 2016, 'Chevrolet', 'Equinox', 'Automatic', '1700kg', 'Red', 'Black', 'NA', '2.4L', 4, 'C12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Ingersoll, Canada', 10000, 12000, TRUE, '2022-07-20', 40000),
('1HGCM82633A123421', 2015, 'Mazda', 'CX-5', 'Automatic', '1550kg', 'Gray', 'Black', 'NA', '2.5L', 4, 'M12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 10500, 12500, TRUE, '2022-07-25', 42000);

-- Insert 5 vehicles for August 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A473282', 2007, 'Hyundai', 'Tucson', 'Automatic', '1650kg', 'Black', 'Gray', 'NA', '2.0L', 4, '473682', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 11000, 13000, TRUE, '2022-08-05', 38000),
('1HGCM82633A232122', 2017, 'Kia', 'Sportage', 'Automatic', '1600kg', 'White', 'Black', 'NA', '2.4L', 4, 'K12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Kia Plant, Gwangju, South Korea', 10500, 12500, TRUE, '2022-08-10', 40000),
('1HGCM82633A834298', 2016, 'Nissan', 'Rogue', 'Automatic', '1650kg', 'Silver', 'Gray', 'NA', '2.5L', 4, 'N12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Nissan Plant, Smyrna, USA', 9500, 11500, TRUE, '2022-08-15', 42000),
('1HGCM82633A985462', 2015, 'Toyota', 'Highlander', 'Automatic', '1800kg', 'Blue', 'Black', 'NA', '3.5L', 4, 'T12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Princeton, USA', 12000, 14000, TRUE, '2022-08-20', 45000),
('1HGCM82633A233256', 2014, 'Honda', 'Pilot', 'Automatic', '1850kg', 'Red', 'Gray', 'NA', '3.5L', 4, 'H12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Lincoln, USA', 11500, 13500, TRUE, '2-08-25', 47000);

-- Insert 2 vehicles for September 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A334209', 2017, 'Chevrolet', 'Traverse', 'Automatic', '1950kg', 'Gray', 'Black', 'NA', '3.6L', 4, 'C12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Lansing, USA', 12500, 14500, TRUE, '2022-09-10', 48000),
('1HGCM82633A947267', 2018, 'Jeep', 'Grand Cherokee', 'Automatic', '2000kg', 'Black', 'Black', 'NA', '3.6L', 4, 'J12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Jeep Plant, Detroit, USA', 13000, 15000, TRUE, '2022-09-20', 45000);

-- Insert 2 vehicles for October 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A904453', 2019, 'Mazda', 'CX-9', 'Automatic', '1900kg', 'White', 'Gray', 'NA', '2.5L', 4, 'M12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 13500, 15500, TRUE, '2022-10-10', 30000),
('1HGCM82633A989234', 2020, 'Hyundai', 'Santa Fe', 'Automatic', '1750kg', 'Silver', 'Black', 'NA', '2.4L', 4, 'H12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 14500, 16500, TRUE, '2022-10-20', 28000);

-- Insert 1 vehicle for November 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A232354', 2021, 'Toyota', '4Runner', 'Automatic', '1900kg', 'Red', 'Black', 'NA', '4.0L', 4, 'T12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Tahara, Japan', 20000, 22000, TRUE, '2022-11-15', 20000);

-- Insert 2 vehicles for December 2022
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A989423', 2020, 'Ford', 'Explorer', 'Automatic', '2000kg', 'Black', 'Gray', 'NA', '3.5L', 4, 'F12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Ford Plant, Chicago, USA', 18000, 20000, TRUE, '2022-12-05', 25000),
('1HGCM82633A236428', 2019, 'Chevrolet', 'Tahoe', 'Automatic', '2100kg', 'White', 'Black', 'NA', '5.3L', 4, 'C12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Arlington, USA', 25000, 27000, TRUE, '2023-12-20', 23000);

-- Insert 1 vehicle for January 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A980823', 2020, 'Nissan', 'Murano', 'Automatic', '1900kg', 'Gray', 'Black', 'NA', '3.5L', 4, 'N12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Nissan Plant, Canton, USA', 15000, 17000, TRUE, '2023-01-10', 28000);

-- Insert 2 vehicles for February 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A783023', 2019, 'Subaru', 'Forester', 'Automatic', '1700kg', 'Silver', 'Black', 'NA', '2.5L', 4, 'S12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Subaru Plant, Ota, Japan', 13000, 15000, TRUE, '2023-02-05', 30000),
('1HGCM82633A909872', 2018, 'Toyota', 'Land Cruiser', 'Automatic', '2300kg', 'Black', 'Gray', 'NA', '4.6L', 4, 'T12349', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Tahara, Japan', 28000, 30000, TRUE, '2023-02-20', 40000);

-- Insert 4 vehicles for March 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A740985', 2015, 'Mazda', 'Mazda6', 'Automatic', '1450kg', 'Silver', 'Black', 'NA', '2.5L', 4, 'M12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 6000, 8000, TRUE, '2023-03-10', 60000),
('1HGCM82633A287849', 2014, 'Hyundai', 'Sonata', 'Automatic', '1500kg', 'Blue', 'Gray', 'NA', '2.4L', 4, 'H12346', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 5000, 7000, TRUE, '2023-03-15', 70000),
('1HGCM82633A905837', 2013, 'Kia', 'Optima', 'Automatic', '1520kg', 'Black', 'Beige', 'NA', '2.4L', 4, 'K12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Kia Plant, Gwangju, South Korea', 5500, 7500, TRUE, '2023-03-20', 65000),
('1HGCM82633A905645', 2012, 'Volkswagen', 'Passat', 'Automatic', '1550kg', 'Red', 'Black', 'NA', '2.0L', 4, 'V12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Volkswagen Plant, Wolfsburg, Germany', 6500, 8500, TRUE, '2023-03-25', 75000);

-- Insert 2 vehicles for April 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A849264', 2019, 'Nissan', 'Altima', 'Automatic', '1450kg', 'White', 'Beige', 'NA', '2.5L', 4, 'N12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Nissan Plant, Yokohama, Japan', 8500, 10500, TRUE, '2023-04-10', 35000),
('1HGCM82633A849245', 2020, 'Chevrolet', 'Malibu', 'Automatic', '1550kg', 'Gray', 'Black', 'NA', '2.0L', 4, 'C12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Detroit, USA', 9000, 11000, TRUE, '2023-04-20', 30000);

-- Insert 3 vehicles for May 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A740294', 2018, 'Honda', 'Accord', 'Automatic', '1500kg', 'Blue', 'Black', 'NA', '2.4L', 4, 'H12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Tokyo, Japan', 8000, 10000, TRUE, '2023-05-10', 40000),
('1HGCM82633A453567', 2017, 'Toyota', 'Camry', 'Automatic', '1400kg', 'Red', 'Gray', 'NA', '2.5L', 4, 'T12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Nagoya, Japan', 7500, 9500, TRUE, '2023-05-15', 45000),
('1HGCM82633A347645', 2016, 'Ford', 'Fusion', 'Automatic', '1600kg', 'Black', 'Black', 'NA', '2.0L', 4, 'F12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Ford Plant, Michigan, USA', 7000, 9000, TRUE, '2023-05-20', 50000);

-- Insert 3 vehicles for June 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A905982', 2017, 'Subaru', 'Outback', 'Automatic', '1650kg', 'Green', 'Black', 'NA', '2.5L', 4, 'S12345', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Subaru Plant, Ota, Japan', 12000, 14000, TRUE, '2023-06-10', 30000),
('1HGCM82633A899834', 2018, 'Jeep', 'Cherokee', 'Automatic', '1800kg', 'White', 'Black', 'NA', '3.2L', 4, 'J12345', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Jeep Plant, Toledo, USA', 13000, 15000, TRUE, '2023-06-15', 32000),
('1HGCM82633A347656', 2019, 'Toyota', 'RAV4', 'Automatic', '1750kg', 'Black', 'Gray', 'NA', '2.5L', 4, 'T12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Woodstock, Canada', 14000, 16000, TRUE, '2023-06-20', 28000);

-- Insert 4 vehicles for July 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A896343', 2018, 'Ford', 'Escape', 'Automatic', '1600kg', 'Silver', 'Black', 'NA', '2.0L', 4, '123468', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Ford Plant, Louisville, USA', 11000, 13000, TRUE, '2023-07-10', 35000),
('1HGCM82633A978982', 2017, 'Honda', 'CR-V', 'Automatic', '1600kg', 'Blue', 'Gray', 'NA', '1.5L', 4, 'H12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Swindon, UK', 11500, 13500, TRUE, '2023-07-15', 36000),
('1HGCM82633A435344', 2016, 'Chevrolet', 'Equinox', 'Automatic', '1700kg', 'Red', 'Black', 'NA', '2.4L', 4, 'C12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Ingersoll, Canada', 10000, 12000, TRUE, '2023-07-20', 40000),
('1HGCM82633A465577', 2015, 'Mazda', 'CX-5', 'Automatic', '1550kg', 'Gray', 'Black', 'NA', '2.5L', 4, 'M12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 10500, 12500, TRUE, '2023-07-25', 42000);

-- Insert 5 vehicles for August 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A568756', 2018, 'Hyundai', 'Tucson', 'Automatic', '1650kg', 'Black', 'Gray', 'NA', '2.0L', 4, 'H12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 11000, 13000, TRUE, '2023-08-05', 38000),
('1HGCM82633A092344', 2017, 'Kia', 'Sportage', 'Automatic', '1600kg', 'White', 'Black', 'NA', '2.4L', 4, 'K12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Kia Plant, Gwangju, South Korea', 10500, 12500, TRUE, '2023-08-10', 40000),
('1HGCM82633A856522', 2016, 'Nissan', 'Rogue', 'Automatic', '1650kg', 'Silver', 'Gray', 'NA', '2.5L', 4, 'N12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Nissan Plant, Smyrna, USA', 9500, 11500, TRUE, '2023-08-15', 42000),
('1HGCM82633A927532', 2015, 'Toyota', 'Highlander', 'Automatic', '1800kg', 'Blue', 'Black', 'NA', '3.5L', 4, 'T12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Princeton, USA', 12000, 14000, TRUE, '2023-08-20', 45000),
('1HGCM82633A529302', 2014, 'Honda', 'Pilot', 'Automatic', '1850kg', 'Red', 'Gray', 'NA', '3.5L', 4, 'H12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Lincoln, USA', 11500, 13500, TRUE, '2023-08-25', 47000);

-- Insert 2 vehicles for September 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A235667', 2017, 'Chevrolet', 'Traverse', 'Automatic', '1950kg', 'Gray', 'Black', 'NA', '3.6L', 4, 'C12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Lansing, USA', 12500, 14500, TRUE, '2023-09-10', 48000),
('1HGCM82633A563545', 2018, 'Jeep', 'Grand Cherokee', 'Automatic', '2000kg', 'Black', 'Black', 'NA', '3.6L', 4, 'J12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Jeep Plant, Detroit, USA', 13000, 15000, TRUE, '2023-09-20', 45000);

-- Insert 2 vehicles for October 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A354655', 2019, 'Mazda', 'CX-9', 'Automatic', '1900kg', 'White', 'Gray', 'NA', '2.5L', 4, 'M12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 13500, 15500, TRUE, '2023-10-10', 30000),
('1HGCM82633A456455', 2020, 'Hyundai', 'Santa Fe', 'Automatic', '1750kg', 'Silver', 'Black', 'NA', '2.4L', 4, 'H12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 14500, 16500, TRUE, '2023-10-20', 28000);

-- Insert 1 vehicle for November 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A456545', 2021, 'Toyota', '4Runner', 'Automatic', '1900kg', 'Red', 'Black', 'NA', '4.0L', 4, 'T12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Tahara, Japan', 20000, 22000, TRUE, '2023-11-15', 20000);

-- Insert 2 vehicles for December 2023
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A485394', 2020, 'Ford', 'Explorer', 'Automatic', '2000kg', 'Black', 'Gray', 'NA', '3.5L', 4, 'F12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Ford Plant, Chicago, USA', 18000, 20000, TRUE, '2023-12-05', 25000),
('1HGCM82633A345345', 2019, 'Chevrolet', 'Tahoe', 'Automatic', '2100kg', 'White', 'Black', 'NA', '5.3L', 4, 'C12348', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Arlington, USA', 25000, 27000, TRUE, '2023-12-20', 23000);

-- Insert 1 vehicle for January 2024
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A123484', 2020, 'Nissan', 'Murano', 'Automatic', '1900kg', 'Gray', 'Black', 'NA', '3.5L', 4, 'N12347', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Nissan Plant, Canton, USA', 15000, 17000, TRUE, '2024-01-10', 28000);

-- Insert 2 vehicles for February 2024
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A123485', 2019, 'Subaru', 'Forester', 'Automatic', '1700kg', 'Silver', 'Black', 'NA', '2.5L', 4, 'S12346', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Subaru Plant, Ota, Japan', 13000, 15000, TRUE, '2024-02-05', 30000),
('1HGCM82633A123486', 2018, 'Toyota', 'Land Cruiser', 'Automatic', '2300kg', 'Black', 'Gray', 'NA', '4.6L', 4, 'T12349', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Tahara, Japan', 28000, 30000, TRUE, '2024-02-20', 40000);

-- Insert 4 vehicles for March
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A123461', 2015, 'Mazda', 'Mazda6', 'Automatic', '1450kg', 'Silver', 'Black', 'NA', '2.5L', 4, 'M12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 6000, 8000, TRUE, '2024-03-10', 60000),
('1HGCM82633A123462', 2014, 'Hyundai', 'Sonata', 'Automatic', '1500kg', 'Blue', 'Gray', 'NA', '2.4L', 4, 'H12346', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 5000, 7000, TRUE, '2024-03-15', 70000),
('1HGCM82633A123463', 2013, 'Kia', 'Optima', 'Automatic', '1520kg', 'Black', 'Beige', 'NA', '2.4L', 4, 'K12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Kia Plant, Gwangju, South Korea', 5500, 7500, TRUE, '2024-03-20', 65000),
('1HGCM82633A123464', 2012, 'Volkswagen', 'Passat', 'Automatic', '1550kg', 'Red', 'Black', 'NA', '2.0L', 4, 'V12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Volkswagen Plant, Wolfsburg, Germany', 6500, 8500, TRUE, '2024-03-25', 75000);

-- Insert 2 vehicles for April 2024
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A123459', 2009, 'Nissan', 'Altima', 'Automatic', '1450kg', 'White', 'Beige', 'NA', '2.5L', 4, 'N12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Nissan Plant, Yokohama, Japan', 8500, 10500, TRUE, '2024-04-10', 135560),
('1HGCM82633A123460', 2016, 'Chevrolet', 'Malibu', 'Automatic', '1550kg', 'Gray', 'Black', 'NA', '2.0L', 4, 'C12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Detroit, USA', 9000, 11000, TRUE, '2024-04-20', 35065);

-- Insert 3 vehicles for May 2024
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A123456', 2018, 'Honda', 'Accord', 'Automatic', '1500kg', 'Blue', 'Black', 'NA', '2.4L', 4, 'H12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Tokyo, Japan', 8000, 10000, FALSE, '2024-05-10', 43340),
('1HGCM82633A123457', 2017, 'Toyota', 'Camry', 'Automatic', '1400kg', 'Red', 'Gray', 'NA', '2.5L', 4, 'T12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Nagoya, Japan', 7500, 9500, TRUE, '2024-05-15', 45056),
('1HGCM82633A123458', 2016, 'Ford', 'Fusion', 'Automatic', '1600kg', 'Black', 'Black', 'NA', '2.0L', 4, 'F12345', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Ford Plant, Michigan, USA', 7000, 9000, TRUE, '2024-05-20', 50453);

-- Insert 5 vehicles for June 2024
INSERT INTO vehicles (vin, year, make, model, transmission, weight, exterior_color, interior_color, engine_brake, engine, doors, stock_number, fuel, title, front_airbags, knee_airbags, side_airbags, curtain_airbags, seat_cushion_airbags, other_restraint_info, plant_info, purchase_price, sale_price, is_sold, sale_date, mileage) VALUES
('1HGCM82633A486438', 2019, 'Mazda', 'Mazda3', 'Automatic', '1450kg', 'Gray', 'Black', 'NA', '2.5L', 4, '486438', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Mazda Plant, Hiroshima, Japan', 10500, 12995, TRUE, '2024-06-05', 30991),
('1HGCM82633A914326', 2020, 'Chevrolet', 'Malibu', 'Automatic', '1550kg', 'White', 'Gray', 'NA', '2.0L', 4, '914326', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Chevrolet Plant, Detroit, USA', 12000, 13995, FALSE, '2024-06-15', 285045),
('1HGCM82633A585634', 2005, 'Toyota', 'Rav-4', 'Automatic', '1800kg', 'Blue', 'Black', 'NA', '3.5L', 4, '585634', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Toyota Plant, Princeton, USA', 9050, 11995, FALSE, '2023-08-20', 158363),
('1HGCM82633A748316', 2004, 'Honda', 'Pilot', 'Automatic', '1850kg', 'Red', 'Gray', 'NA', '3.5L', 4, '748316', 'Gasoline', 'SUV', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Honda Plant, Lincoln, USA', 11500, 13500, FALSE, '2023-08-25', 187307),
('1HGCM82633A839473', 2006, 'Hyundai', 'Sonata', 'Automatic', '1500kg', 'Blue', 'Gray', 'NA', '2.4L', 4, '839473', 'Gasoline', 'Sedan', 'Front', 'N/A', 'Side', 'Curtain', 'N/A', 'N/A', 'Hyundai Plant, Ulsan, South Korea', 5000, 7000, TRUE, '2024-03-15', 170560);



-- Customer seed Data --
INSERT INTO customers (firstname, lastname, email, address, phone, "group") VALUES
('Alex', 'Smith', 'alex.smith@gmail.com', '123 Main St, Riverview, NB', '506-921-7832', 'Dealer'),
('Bobby', 'Brooks', 'bobby.brooks@outlook.com', '456 Elm St, Dieppe, NB', '506-873-5678', 'Customer'),
('Chad', 'Connors', 'chad.connors@hootmail.com', '789 Oak St, Amherts, NS', '902-382-8765', 'Dealer'),
('Emily', 'Davis', 'emily.davis@gmail.com', '101 Pine St, Moncton, NB', '506-875-2945', 'Dealer'),
('Frank', 'Fuller', 'frank.fuller@outlook.com', '202 Maple St, Salisbury, CA', '506-866-9253', 'Customer');

