import { createTypeormConn } from '../utils/createTypeormConn';

export const connectDB = async () => {
  try {
    await createTypeormConn();
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
