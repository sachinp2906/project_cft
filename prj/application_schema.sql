DROP TABLE IF EXIST "users"
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    pasword VARCHAR(255) NOT NULL
)

DROP TABLE IF EXIST "categories"
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)

DROP TABLE IF EXIST "services"
CREATE TABLE services(
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Normal' , 'VIP')) NOT NULL,
    option VARCHAR(50) CHECK (option IN ('Hourly' , 'Weekly' , 'Monthly'))
)

DROP TABLE IF EXIST "service_price_option"
CREATE TABLE service_price_option(
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL,
    price NUMERIC(10 , 2) NOT NULL,
    type VARCHAR(50) CHECK (type IN('Hourly' , 'Weekly' , 'Monthly')) NOT NULL
)