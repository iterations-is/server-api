/**
 * @file Authorization
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const express = require('express');
const router = express.Router();

import permissions from '@middlewares/permissions.mw';
import { genResponseSuccessData } from '@utils/response.util';

/**
 * Get notifications
 */
router.get('/', permissions(['notifications.managements']), async (req, res) => {
   res.send(genResponseSuccessData('User notifications', {}));
});

module.exports = router;
