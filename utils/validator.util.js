/**
 * @file Validation tools
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

/**
 * Temporary token validation
 * @param {string} tokenTmp Temporary token
 * @returns {boolean}
 */
module.exports.isTokenTmp = tokenTmp => {
   return tokenTmp && tokenTmp.length === 77;
};
