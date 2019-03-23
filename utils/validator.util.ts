/**
 * @file Validation tools
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

/**
 * Temporary token validation
 * @param tokenTmp Temporary token
 */
export const validateTokenTemporary = (tokenTmp: string): boolean => {
   return tokenTmp && tokenTmp.length === 77;
};
