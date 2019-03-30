/**
 * @file JSON response executors
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import logger from '@utils/logger.util';

const recognizeSuccess = (code: number) => (code >= 200 && code < 300 ? 'success' : 'error');

// -------------------------------------------------------------------------------------------------
// Responses
// -------------------------------------------------------------------------------------------------

/**
 * Execute simple text response
 * @param res Response object from ExpressJS
 * @param code Response code
 * @param message Response description
 */
export const responseSimple = (res, code: number, message: string = ''): object => {
   return res.status(code).json({
      cod: code,
      typ: recognizeSuccess(code),
      msg: message,
   });
};

/**
 * Generate success response with data
 * @param res Response object from ExpressJS
 * @param code Response code
 * @param message Response description
 * @param data Response payload data
 */
export const responseData = (
   res,
   code: number,
   message: string = '',
   data: object = {},
): object => {
   return res.status(code).json({
      cod: code,
      typ: recognizeSuccess(code),
      msg: message,
      dat: data,
   });
};

/**
 * Generate error response with invalid descriptions
 * @param res Response object from ExpressJS
 * @param code Response code
 * @param message Response description
 * @param invalid Array of short descriptions of invalid params
 * @param data Response payload data
 */
export const responseInvalidData = (
   res,
   code: number,
   message: string,
   invalid: string[] = [],
   data: object = {},
): object => {
   return res.status(code).json({
      cod: code,
      typ: recognizeSuccess(code),
      msg: message,
      dat: {
         ...data,
         invalid: invalid,
      },
   });
};

logger.debug('Utility:JSONResponse start.');
