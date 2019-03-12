/**
 * @file Router: Auth
 * @author Sergey Dunaevskiy
 */

const jwt = require('jsonwebtoken');
const configJWT = require('../config/jwt.config');
const express = require('express');
const router = express.Router();

// define the home page route
router.get('/', (req, res) => {
   // generate a constant token, no need to be fancy here
   const token = jwt.sign(
      {
         user_id: '42',
         user_name: 'Charlotte White',
      },
      configJWT.secret,
      {
         expiresIn: 10,
      },
   );

   // Send new jwt token to user
   res.json({ token: token });
});

module.exports = router;
