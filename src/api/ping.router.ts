/**
 * @file Ping API Router
 * @description Pure text pings to make sure that server works with authorized and unauthorized requests.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { mwPingWithAuth, mwPingWithoutAuth } from '@middlewares/api/ping.mw';

const express = require('express');
const router = express.Router();

router.get('/auth/with', mwPingWithAuth);
router.get('/auth/without', mwPingWithoutAuth);
export default router;
