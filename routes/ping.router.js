/**
 * @file Router: Ping
 * @author Sergey Dunaevskiy
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.json({ msg: 'Everything is ok, token is valid.' });
});

module.exports = router;
