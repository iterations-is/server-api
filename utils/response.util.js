/**
 * @file JSON response generator
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const responseTypes = {
   error: 'error',
   success: 'success',
};

module.exports.responseTypes = responseTypes;

// -------------------------------------------------------------------------------------------------
// Custom
// -------------------------------------------------------------------------------------------------

/**
 * Generate custom simple response
 * @param {string} type One of responseTypes
 * @param {string} message Response description
 * @returns {{msg: string, typ: string}}
 */
module.exports.genCusSim = (type, message) => {
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
 * @param {string} message Success description
 * @returns {{msg: string, typ: string}}
 */
module.exports.genSucSim = message => {
   return {
      typ: responseTypes.success,
      msg: message,
   };
};

/**
 * Generate success response with data
 * @param {string} message Success description
 * @param {object} data Data to send
 * @returns {{msg: string, dat: object, typ: string}}
 */
module.exports.genSucDat = (message, data) => {
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
 * @param {string} message Error description
 * @returns {{msg: string, typ: string}}
 */
module.exports.genErrSim = message => {
   return {
      typ: responseTypes.error,
      msg: message,
   };
};

/**
 * Generate error response with data
 * @param {string} message Error description
 * @param {object} data Data to send
 * @returns {{msg: string, dat: object, typ: string}}
 */
module.exports.genErrDat = (message, data) => {
   return {
      typ: responseTypes.error,
      msg: message,
      dat: data,
   };
};
