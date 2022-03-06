import { createConnection } from 'typeorm';

export const connectDB = async () => {
  try {
    await createConnection();
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
