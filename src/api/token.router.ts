/**
 * @file Token API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   mwGetTokenPersistent,
   mwGetTokenTemporary,
   mwVerifyTokenPersistent,
} from '@middlewares/api/token.mw';

const express = require('express');
const router = express.Router();

router.get('/temporary', mwGetTokenTemporary);
router.get('/persistent', mwGetTokenPersistent);
router.get('/verify', mwVerifyTokenPersistent);
export default router;
