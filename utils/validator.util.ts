import logger from '@utils/logger.util';

/**
 * @file Validation tools
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const joi = require('joi');

/**
 * Temporary token validation
 * @param tokenTmp Temporary token
 */
export const validateTokenTemporary = (tokenTmp: string): boolean => {
   return tokenTmp && tokenTmp.length === 77;
};

/**
 * JSON joi validation
 * @param object
 * @param schema
 */
export const validateViaJoiSchema = (object: object, schema: object): boolean => {
   const result = joi.validate(object, schema);
   return result.error === null;
};

logger.debug('Utility:Validator start.');
