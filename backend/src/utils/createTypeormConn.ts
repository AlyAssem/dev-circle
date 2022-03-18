import { createConnection, getConnectionOptions } from 'typeorm';

export const createTypeormConn = async () => {
  // grab options from ormconfig best on node_env.
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  return createConnection({ ...connectionOptions, name: 'default' });
};
