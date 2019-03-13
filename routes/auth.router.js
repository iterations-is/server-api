/**
 * @file Router: /auth
 * @author Sergey Dunaevskiy
 */

const jwt = require('jsonwebtoken');
const configJWT = require('../config/jwt.config');
const express = require('express');
const router = express.Router();
const passport = require('passport');

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

router.get('/fail', (req, res) => {
   res.send('Fail');
});

router.get('/succ', (req, res) => {
   res.send('Success');
});

// Redirect to github to authorize
router.get(
   '/service/github',
   (req, res, next) => {
      console.log(`I am /api/login/service/github`);
      next();
   },
   passport.authenticate('github'),
   (req, res) => {},
);

// Callback from
router.get(
   '/service/github/callback',
   passport.authenticate('github', {
      failureRedirect: 'http://localhost:3001/api/login/fail',
   }),
   function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('http://localhost:3001/api/login/succ');
   },
);

module.exports = router;
