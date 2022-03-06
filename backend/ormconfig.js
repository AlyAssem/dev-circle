const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  type: 'postgres',
  database: 'devcircle_prod',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
  entities: [path.join(__dirname, './dist/entities/*')],
  migrations: [path.join(__dirname, './dist/migration/*')],
  cli: {
    migrationsDir: './src/migration',
  },
};
