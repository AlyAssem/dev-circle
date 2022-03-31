import { createTypeormConn } from '../utils/createTypeormConn';

export const connectDB = async () => {
  try {
    const conn = await createTypeormConn();
    console.log('Database connected successfully');
    return conn;
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
