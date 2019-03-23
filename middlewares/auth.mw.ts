/**
 * @file Middleware for auth validation
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */


const jwt = require('jsonwebtoken');
import configJWT from '@config/jwt.config';
import { genResponseErrorData } from "@utils/response.util";

// Data
const authFreeRoutes = [
   // OAuth pages
   '/pages/github',
   '/pages/github/callback',
   '/pages/github/failure',

   // Authorization api
   '/api/auth/token/temporary',
   '/api/auth/token/persistent',

   // Ping
   '/api/ping/auth/without',
];

module.exports = (req, res, next) => {
   // Skip auth validation if current request is auth free
   for (let i = 0; i < authFreeRoutes.length; i++)
      if (req.path === authFreeRoutes[i]) return next();

   // Auth is required
   try {
      // Get JWT from the request header Authorization and verify
      const token = req.headers.authorization;
      jwt.verify(token, configJWT.secret);
   } catch (err) {
      // JWT is missing OR expired OR unexpected error
      return res.status(401).json(
         genResponseErrorData('Unauthorized', {
            reason: err.message,
         }),
      );
   }

   next();
};