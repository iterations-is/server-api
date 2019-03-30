/**
 * @file Middleware for auth validation
 * @description
 * Runs automatically with each server request (exclude authFreePages). Verifies
 * JWT token and sends its payload to next middleware (accessible via 'req.jwt').
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import configJWT from '@config/jwt.config';
import { responseInvalidData } from '@utils/response.util';

const jwt = require('jsonwebtoken');

// Data
const authFreeRoutes = [
   // OAuth pages
   '/pages/github',
   '/pages/github/callback',
   '/pages/github/failure',

   // Authorization api
   '/api/token/temporary',
   '/api/token/persistent',

   // Ping
   '/api/ping/auth/without',
];

export default (req, res, next) => {
   // Skip auth validation if current request is auth free
   for (let i = 0; i < authFreeRoutes.length; i++)
      if (req.path === authFreeRoutes[i]) return next();

   // Auth is required
   try {
      // Get JWT from the request header Authorization and verify
      // "Bearer JWT.TOKEN.STRING"
      const token = req.headers.authorization;
      req.jwt = jwt.verify(token, configJWT.secret);
   } catch (err) {
      return responseInvalidData(res, 401, 'Unauthorized', [
         'authorization token is missing or invalid',
      ]);
   }

   next();
};
