-- Table: public.photos

-- DROP TABLE IF EXISTS public.photos;
-- DROP TABLE IF EXISTS public.vehicles;
-- DROP TABLE IF EXISTS public.session;
-- DROP TABLE IF EXISTS public.users;


CREATE TABLE IF NOT EXISTS public.vehicles
(
    id integer NOT NULL DEFAULT nextval('vehicles_id_seq'::regclass),
    vin character varying(100) COLLATE pg_catalog."default" NOT NULL UNIQUE,
    year integer,
    make character varying(100) COLLATE pg_catalog."default",
    model character varying(100) COLLATE pg_catalog."default",
    transmission character varying(100) COLLATE pg_catalog."default",
    weight character varying(100) COLLATE pg_catalog."default",
    exterior_color character varying(100) COLLATE pg_catalog."default",
    interior_color character varying(100) COLLATE pg_catalog."default",
    engine_brake character varying(100) COLLATE pg_catalog."default",
    engine character varying(100) COLLATE pg_catalog."default",
    doors integer,
    stock_number character varying(100) COLLATE pg_catalog."default",
    fuel character varying(100) COLLATE pg_catalog."default",
    title character varying(100) COLLATE pg_catalog."default",
    front_airbags character varying(150) COLLATE pg_catalog."default",
    knee_airbags character varying(150) COLLATE pg_catalog."default",
    side_airbags character varying(150) COLLATE pg_catalog."default",
    curtain_airbags character varying(255) COLLATE pg_catalog."default",
    seat_cushion_airbags character varying(255) COLLATE pg_catalog."default",
    other_restraint_info character varying(255) COLLATE pg_catalog."default",
    plant_info character varying(100) COLLATE pg_catalog."default",
    purchase_price numeric,
    sale_price numeric,
    is_sold boolean DEFAULT false,
    sale_date date,
    mileage INTEGER,
    CONSTRAINT vehicles_pkey PRIMARY KEY (id),
    CONSTRAINT vehicles_vin_key UNIQUE (vin)
);


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.vehicles
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.photos
(
    id integer NOT NULL DEFAULT nextval('photos_id_seq'::regclass),
    vehicle_id integer,
    photo_url text COLLATE pg_catalog."default",
    CONSTRAINT photos_pkey PRIMARY KEY (id),
    CONSTRAINT photos_vehicle_id_fkey FOREIGN KEY (vehicle_id)
        REFERENCES public.vehicles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.photos
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.session
(
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    firstname character varying(40) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(40) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.customers (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(40) NOT NULL,
    lastname VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
	phone VARCHAR(20) NOT NULL,
    "group" VARCHAR(100)
);

