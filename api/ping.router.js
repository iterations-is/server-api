/**
 * @file Simple ping
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const express = require('express');
const router = express.Router();
const utilResponse = require('utils/response.util');

router.get('/auth/with', (req, res) => {
   res.json(utilResponse.genSucSim('Everything is ok, user is authorized.'));
});

router.get('/auth/without', (req, res) => {
   res.json(utilResponse.genSucSim('Everything is ok, auth is not required.'));
});

module.exports = router;
