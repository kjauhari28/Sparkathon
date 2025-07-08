// Database table names
export const TABLES = {
  SKUS: 'skus',
  STORES: 'stores',
  STORE_SKUS: 'store_skus',
  SALES_DATA: 'sales_data'
};

// API response messages
export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation failed',
};

// HTTP status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Environment constants
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};
