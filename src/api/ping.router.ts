/**
 * @file Ping API Router
 * @description Pure text pings to make sure that server works with authorized and unauthorized requests.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { genResponseSuccessData, genResponseSuccessSimple } from '@utils/response.util';

const express = require('express');
const router = express.Router();

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.get('/auth/with', pingWithAuth);
router.get('/auth/without', pingWithoutAuth);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * @desc API ping to make sure that authorization middleware works. Return user JWT payload.
 * @param req
 * @param res
 */
async function pingWithAuth(req, res) {
   res.json(
      genResponseSuccessData('Everything is ok, user is authorized with JWT.', {
         jwt: req.jwt,
      }),
   );
}

/**
 * @desc API ping to make sure that server is online (should be 200 always)
 * @param req
 * @param res
 */
async function pingWithoutAuth(req, res) {
   res.json(genResponseSuccessSimple('Everything is ok, auth is not required.'));
}
