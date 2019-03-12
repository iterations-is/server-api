/**
 * @file Middleware for CORS. Allow different origins.
 * @author Sergey Dunaevskiy
 */

module.exports = (req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization');

   // Preflight request is always 200
   if (req.method === 'OPTIONS') {
      return res.status(200).end();
   }

   next();
};
