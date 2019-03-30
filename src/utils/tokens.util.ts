/**
 * @file Tokens
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import logger from '@utils/logger.util';
import configJWT from '@config/jwt.config';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Temporary token generator
 */
export const generateTokenTemporary = (): string => {
   return crypto.randomBytes(32).toString('hex') + new Date().getTime();
};

/**
 * JWT token generator
 * @param payload Payload data inside JWT
 */
export const generateTokenJWT = (payload: object): string => {
   return jwt.sign(payload, configJWT.secret, { expiresIn: configJWT.expiration });
};

logger.debug('Utility:Tokens start.');
