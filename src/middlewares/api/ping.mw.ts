/**
 * @file Ping
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { responseData, responseSimple } from '@utils/response.util';

/**
 * @desc API ping to make sure that authorization middleware works. Return user JWT payload.
 * @param req
 * @param res
 */
export const mwPingWithAuth = async (req, res, next) => {
   return responseData(res, 200, 'Everything is ok, user is authorized with JWT.', {
      jwt: req.jwt,
   });
};

/**
 * @desc API ping to make sure that server is online (should be 200 always)
 * @param req
 * @param res
 */
export const mwPingWithoutAuth = async (req, res, next) => {
   return responseSimple(res, 200, 'Everything is ok, auth is not required.');
};
