/**
 * @file Middleware for auth validation
 * @author Sergey Dunaevskiy
 */

const jwt = require('jsonwebtoken');
const configJWT = require('../config/jwt.config');

// Data
const authFreeRoutes = ['/api/login'];

module.exports = (req, res, next) => {
   // Skip auth validation if current request is auth free
   for (let i = 0; i < authFreeRoutes.length; i++) {
      if (req.path === authFreeRoutes[i]) return next();
   }

   // Auth is required
   try {
      // Get jwt from the request header Authorization and verify
      const token = req.headers.authorization;
      let jwtData = jwt.verify(token, configJWT.secret);
   } catch (err) {
      // jwt missing OR
      // jwt expired OR
      // unexpected error
      return res.status(401).json({ msg: err.message });
   }

   // next middleware
   next();
};
