import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const connectDB = async () => {
  try {
    await createConnection({
      type: 'postgres',
      database: 'devcircle',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: true,
      synchronize: true,
      entities: [path.join(__dirname, '../entities/*')],
    });
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
