/**
 * @file Ping
 * @description Pure text pings to make sure that server works with authorized and unauthorized requests.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const express = require('express');
const router = express.Router();
import { genResponseSuccessData, genResponseSuccessSimple } from '@utils/response.util';

/**
 * API ping to make sure that authorization middleware works. Return user JWT payload.
 */
router.get('/auth/with', (req, res) => {
   res.json(
      genResponseSuccessData('Everything is ok, user is authorized with JWT.', {
         jwt: req.jwt,
      }),
   );
});

/**
 * API ping to make sure that server is online (should be 200 always)
 */
router.get('/auth/without', (req, res) => {
   res.json(genResponseSuccessSimple('Everything is ok, auth is not required.'));
});

module.exports = router;
