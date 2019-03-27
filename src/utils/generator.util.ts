/**
 * @file Generator tools
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import logger from '@utils/logger.util';

const crypto = require('crypto');

/**
 * Temporary token generator
 */
export const generateTokenTemporary = (): string => {
   return crypto.randomBytes(32).toString('hex') + new Date().getTime();
};

logger.debug('Utility:Generator start.');
