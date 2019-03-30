/**
 * @file TypeORM wrappers
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   createConnection,
   getConnection as getConnectionTypeorm,
   getManager as getManagerTypeorm,
   getConnectionOptions,
} from 'typeorm';
import logger from '@utils/logger.util';

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
   return getConnectionTypeorm(process.env.NODE_ENV);
};

/**
 * Get current database connection.
 */
export const getManager = () => {
   return getManagerTypeorm(process.env.NODE_ENV);
};

logger.debug('Utility:TypeORM wrapper start.');
