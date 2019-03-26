/**
 * @file JSON response generator
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

/**
 * Default response types
 */
export const responseTypes = {
   error: 'error',
   success: 'success',
};

// -------------------------------------------------------------------------------------------------
// Custom
// -------------------------------------------------------------------------------------------------

/**
 * Generate custom simple response
 * @param type One of responseTypes
 * @param message Response description
 */
export const genResponseCustomSimple = (type: string, message: string): object => {
   return {
      typ: type,
      msg: message,
   };
};

// -------------------------------------------------------------------------------------------------
// Success
// -------------------------------------------------------------------------------------------------

/**
 * Generate success simple response
 * @param message Success description
 */
export const genResponseSuccessSimple = (message: string): object => {
   return {
      typ: responseTypes.success,
      msg: message,
   };
};

/**
 * Generate success response with data
 * @param message Success description
 * @param data Data to send
 */
export const genResponseSuccessData = (message: string, data: object): object => {
   return {
      typ: responseTypes.success,
      msg: message,
      dat: data,
   };
};

// -------------------------------------------------------------------------------------------------
// Error
// -------------------------------------------------------------------------------------------------

/**
 * Generate error simple response
 * @param message Error description
 */
export const genResponseErrorSimple = (message: string): object => {
   return {
      typ: responseTypes.error,
      msg: message,
   };
};

/**
 * Generate error response with data
 * @param message Error description
 * @param data Data to send
 */
export const genResponseErrorData = (message: string, data: object): object => {
   return {
      typ: responseTypes.error,
      msg: message,
      dat: data,
   };
};

/**
 * Generate error response with invalid descriptions
 * @param message Error description
 * @param invalid Array of short descriptions of invalid params
 * @param data Additional data to send
 */
export const genResponseErrorDataInvalid = (
   message: string,
   invalid: string[],
   data: object = {},
): object => {
   return {
      typ: responseTypes.error,
      msg: message,
      dat: {
         ...data,
         invalid: invalid,
      },
   };
};
