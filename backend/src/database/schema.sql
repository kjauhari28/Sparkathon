-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS sales_data;
DROP TABLE IF EXISTS store_sku;
DROP TABLE IF EXISTS skus;
DROP TABLE IF EXISTS stores;

-- Table: stores
CREATE TABLE IF NOT EXISTS stores (
  store_id VARCHAR(20) PRIMARY KEY,
  geo VARCHAR(50) NOT NULL,
  religion VARCHAR(50)
);

-- Table: skus
CREATE TABLE IF NOT EXISTS skus (
  sku_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  shelf_life_days INTEGER
);

-- Table: store_sku (junction)
CREATE TABLE IF NOT EXISTS store_sku (
  store_id VARCHAR(20) NOT NULL,
  sku_id VARCHAR(20) NOT NULL,
  PRIMARY KEY (store_id, sku_id),
  FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
  FOREIGN KEY (sku_id) REFERENCES skus(sku_id) ON DELETE CASCADE
);

-- Table: sales_data
CREATE TABLE IF NOT EXISTS sales_data (
  id SERIAL PRIMARY KEY,
  store_id VARCHAR(20) NOT NULL,
  sku_id VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  day INTEGER NOT NULL,
  date DATE NOT NULL,
  type_of_day VARCHAR(20),
  initial INTEGER,
  sold INTEGER,
  returns INTEGER,
  donations INTEGER,
  reroutes_in INTEGER,
  reroutes_out INTEGER,
  recycled INTEGER,
  final INTEGER,
  FOREIGN KEY (store_id, sku_id) REFERENCES store_sku(store_id, sku_id)
);

-- Table: stores
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  geo TEXT NOT NULL,
  religion TEXT
);

-- Table: store_skus (many-to-many for stores and skus)
CREATE TABLE IF NOT EXISTS store_skus (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  sku_id INTEGER NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  UNIQUE (store_id, sku_id)
);

CREATE TABLE IF NOT EXISTS sales_data (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  sku_id INTEGER NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  day INTEGER NOT NULL,
  date DATE NOT NULL,
  type_of_day TEXT NOT NULL,
  initial INTEGER NOT NULL,
  sold INTEGER NOT NULL,
  returns INTEGER NOT NULL,
  donations INTEGER NOT NULL,
  reroutes_in INTEGER NOT NULL,
  reroutes_out INTEGER NOT NULL,
  recycled INTEGER NOT NULL,
  final INTEGER NOT NULL
);
