-- Table: skus
CREATE TABLE IF NOT EXISTS skus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  shelf_life INTEGER NOT NULL
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

-- Table: sales_data
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
