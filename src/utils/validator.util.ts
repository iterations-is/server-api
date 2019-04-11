/**
 * @file Validation tools
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import logger from '@utils/logger.util';

const joi = require('joi');

interface joiValidationResponse {
   isValidRequest: boolean;
   verbose: object;
}

/**
 * Temporary token validation
 * @param tokenTmp Temporary token
 */
export const validateTokenTemporary = (tokenTmp: string): boolean => {
   return /^[abcdef0123456789]{77}$/.test(tokenTmp);
};

/**
 * JSON joi validation
 * @param object
 * @param schema
 */
export const validateViaJoiSchema = (object: object, schema: object): boolean => {
   const { error } = joi.validate(object, schema);
   return error === null;
};

/**
 *
 */
export const validateRequestJoi = (
   schemas: object,
   body: object,
   params: object,
): joiValidationResponse => {
   const joiBody = schemas['body'] === null ? { error: null } : joi.validate(body, schemas['body']);
   const joiParams =
      schemas['params'] === null ? { error: null } : joi.validate(params, schemas['params']);
   return {
      isValidRequest: joiBody.error === null && joiParams.error === null,
      verbose: {
         bodyVerbose: joiBody.error,
         paramsVerbose: joiParams.error,
      },
   };
};

logger.debug('Utility:Validator start.');
