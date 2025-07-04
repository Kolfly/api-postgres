require('dotenv').config();

const config = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  },
  TEST_TOKEN: process.env.TEST_TOKEN,
};

module.exports = config;
