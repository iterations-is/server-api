/**
 * @file TypeORM
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   createConnection,
   getConnection as getConnectionTypescript,
   getConnectionOptions,
} from 'typeorm';

/**
 * Connect to primary database and provide its connection as a result.
 * Connect to secondary database to let typeorm do some automatic tasks, close secondary connection.
 */
export const createTypeormConnection = async () => {
   // Create regular connection
   const connectionOptionsPrimary = await getConnectionOptions(process.env.NODE_ENV);
   const connectionPrimary = await createConnection(connectionOptionsPrimary);
   // Create secondary connection for seeds (e.g. test mode needs to run seeds after auto dropSchema)
   const connectionOptionsSecondary = await getConnectionOptions(`${process.env.NODE_ENV}-seed`);
   const connectionSecondary = await createConnection(connectionOptionsSecondary);
   // Auto close (seeds were run)
   await connectionSecondary.close();

   return connectionPrimary;
};

/**
 * Get current database connection.
 */
export const getConnection = () => {
   return getConnectionTypescript(process.env.NODE_ENV);
};
