/**
 * @file Simple ping
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export {};
const express = require('express');
const router = express.Router();
import { genResponseSuccessSimple } from '@utils/response.util';

router.get('/auth/with', (req, res) => {
   res.json(genResponseSuccessSimple('Everything is ok, user is authorized.'));
});

router.get('/auth/without', (req, res) => {
   res.json(genResponseSuccessSimple('Everything is ok, auth is not required.'));
});

module.exports = router;
