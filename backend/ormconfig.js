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
    entities: [path.join(__dirname, './dist/entities/*')],
    migrations: [path.join(__dirname, './dist/migration/*')],
    cli: {
      migrationsDir: './src/migration',
    },
  },
  {
    name: 'test',
    type: 'postgres',
    url: process.env.DATABASE_URL_TEST,
    entities: [path.join(__dirname, './src/entities/*')],
    migrations: [path.join(__dirname, './dist/migration/*')],
    synchronize: true, // synchronize database with entities.
    dropSchema: true, // refresh db before connection.
    cli: {
      migrationsDir: './src/migration',
    },
  },
];
