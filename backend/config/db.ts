import { createConnection, Connection } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { Post } from '../entities/Post';

dotenv.config();

export const connectDB = async () => {
  try {
    const connection: Connection = await createConnection({
      type: 'postgres',
      database: 'devcircle',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: true,
      synchronize: true,
      entities: [path.join(__dirname, '../entities/*.ts')],
    });
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
