const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // database: 'devcircle_prod',
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // logging: true,
  entities: [path.join(__dirname, './dist/entities/*')],
  migrations: [path.join(__dirname, './dist/migration/*')],
  cli: {
    migrationsDir: './src/migration',
  },
};
