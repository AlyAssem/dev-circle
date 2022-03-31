const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = [
  {
    name: 'development',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    migrations: [path.join(__dirname, './dist/migration/*')],
    cli: {
      migrationsDir: './src/migration',
    },
  },
  {
    name: 'test',
    type: 'postgres',
    url: process.env.DATABASE_URL_TEST,
    migrations: [path.join(__dirname, 'dist/migration/*.js')],
    synchronize: true, // synchronize database with entities.
    dropSchema: true, // refresh db before connection.
    cli: {
      migrationsDir: './src/migration',
    },
  },
];
