# Backend - Sparkathon

A Node.js backend application with Supabase integration for authentication and database operations.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (something like `https://your-project.supabase.co`)
   - **Anon public** key
   - **Service role** key (optional, for admin operations)

### 3. Environment Configuration

Update the `.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Database Setup

### 1. Create Tables in Supabase

You can create the database tables in two ways:

**Option A: Using Supabase SQL Editor**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `src/database/schema.sql`
4. Paste and run the SQL commands

**Option B: Using Migration Script**
```bash
# Test database connection
node src/utils/migration.js test

# Run database migration
node src/utils/migration.js migrate

# Check if tables were created
node src/utils/migration.js check

# Seed sample data
node src/utils/migration.js seed

# Or run complete setup
node src/utils/migration.js setup
```

### 2. Database Schema

The database consists of 4 main tables:

**skus** - Product/SKU information
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `shelf_life` (Integer, days)

**stores** - Store information
- `id` (UUID, Primary Key)
- `geo` (Text, Required) - Geographical location
- `religion` (Text) - Religious affiliation

**store_skus** - Many-to-many relationship between stores and SKUs
- `store_id` (UUID, Primary Key, Foreign Key)
- `sku_id` (UUID, Primary Key, Foreign Key)

**sales_data** - Daily sales data with composite primary key
- `store_id` (UUID, Primary Key, Foreign Key)
- `sku_id` (UUID, Primary Key, Foreign Key)
- `year` (Integer, Primary Key)
- `day` (Integer, Primary Key) - Day of year (1-365/366)
- `date` (Date, Required)
- `type_of_day` (Text) - e.g., 'weekday', 'weekend', 'holiday'
- `initial` (Integer) - Initial stock
- `sold` (Integer) - Units sold
- `returns` (Integer) - Units returned
- `donations` (Integer) - Units donated
- `reroutes_in` (Integer) - Units rerouted in
- `reroutes_out` (Integer) - Units rerouted out
- `recycled` (Integer) - Units recycled
- `final` (Integer) - Final stock

### 5. Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Check if the server is running
- `GET /test-db` - Test database connection

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/user` - Get current user

### SKUs
- `GET /api/skus` - Get all SKUs (supports filtering: `?search=milk&shelf_life_max=7`)
- `GET /api/skus/:id` - Get SKU by ID
- `GET /api/skus/name/:name` - Get SKU by name
- `GET /api/skus/filter/short-shelf-life` - Get SKUs with short shelf life
- `POST /api/skus` - Create a new SKU
- `PUT /api/skus/:id` - Update SKU
- `DELETE /api/skus/:id` - Delete SKU

### Stores
- `GET /api/stores` - Get all stores (supports filtering: `?geo=NewYork&religion=Christian`)
- `GET /api/stores/:id` - Get store by ID
- `GET /api/stores/geo/unique` - Get unique geographical locations
- `GET /api/stores/religion/unique` - Get unique religions
- `GET /api/stores/filter/geo/:geo` - Get stores by geographical location
- `GET /api/stores/filter/religion/:religion` - Get stores by religion
- `POST /api/stores` - Create a new store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Store-SKU Relationships
- `GET /api/store-skus` - Get all store-SKU relationships
- `GET /api/store-skus/store/:storeId` - Get all SKUs for a specific store
- `GET /api/store-skus/sku/:skuId` - Get all stores for a specific SKU
- `GET /api/store-skus/exists/:storeId/:skuId` - Check if relationship exists
- `GET /api/store-skus/analytics/sku-count-by-store` - Get SKU count per store
- `POST /api/store-skus` - Create a new store-SKU relationship
- `POST /api/store-skus/batch` - Create multiple relationships
- `DELETE /api/store-skus/:storeId/:skuId` - Delete relationship

### Sales Data
- `GET /api/sales-data` - Get all sales data (supports filtering by date range, store, SKU, etc.)
- `GET /api/sales-data/:storeId/:skuId/:year/:day` - Get specific sales data by primary key
- `GET /api/sales-data/store/:storeId` - Get sales data for a specific store
- `GET /api/sales-data/sku/:skuId` - Get sales data for a specific SKU
- `GET /api/sales-data/type-of-day/:typeOfDay` - Get sales data by type of day
- `GET /api/sales-data/analytics/store/:storeId` - Get analytics for a specific store
- `POST /api/sales-data` - Create new sales data
- `POST /api/sales-data/batch` - Create multiple sales data records
- `PUT /api/sales-data/:storeId/:skuId/:year/:day` - Update sales data
- `DELETE /api/sales-data/:storeId/:skuId/:year/:day` - Delete sales data

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── db/              # Database configuration
│   │   └── index.js     # Supabase client setup
│   ├── middlewares/     # Express middlewares
│   │   └── auth.js      # Authentication middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   │   ├── auth.js      # Authentication routes
│   │   └── users.js     # User routes
│   ├── utils/           # Utility functions
│   │   └── database.js  # Database service class
│   ├── app.js           # Express app setup
│   ├── constants.js     # Application constants
│   └── index.js         # Server entry point
├── .env                 # Environment variables
└── package.json
```

## Usage Examples

### Authentication
```javascript
// Sign up
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Sign in
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

### Protected Routes
To protect routes, use the authentication middleware:

```javascript
import { authenticateToken } from '../middlewares/auth.js';

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

## Features

- ✅ **ES6+ Modules** - Modern ECMAScript import/export syntax
- ✅ Supabase integration for authentication and database
- ✅ JWT-based authentication
- ✅ Generic database service class
- ✅ Error handling middleware
- ✅ CORS support
- ✅ Environment configuration
- ✅ Health check endpoints
- ✅ RESTful API structure
- ✅ **Async/await** - Modern asynchronous programming
- ✅ **Arrow functions** - Concise function syntax
- ✅ **Destructuring** - Object and array destructuring
- ✅ **Template literals** - String interpolation

## Next Steps

1. Update the constants file with your actual table names
2. Create specific models for your data structures
3. Add input validation middleware
4. Implement rate limiting
5. Add logging middleware
6. Create API documentation with Swagger
7. Add unit tests
