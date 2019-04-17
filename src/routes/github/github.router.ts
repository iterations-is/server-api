/**
 * @file Github OAuth
 * @description Github OAuth init and callback pages.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import configServer from '@config/server.config';
import { redisSetTokenIntoStorage } from '@utils/redis.util';
import { validateTokenTemporary } from '@utils/validator.util';
import { getConnection, getManager } from '@utils/typeorm.util';
import { getRepository } from 'typeorm';
import { UsersModel } from '@modelsSQL/Users.model';

const express = require('express');
const router = express.Router();
const passport = require('passport');

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.get(
   '/',
   githubRedirectSession,
   passport.authenticate('github', {
      session: false,
   }),
);
router.get(
   '/callback',
   passport.authenticate('github', {
      session: false,
      failureRedirect: `${configServer.domain}/pages/github/failure`,
   }),
   githubCallback,
);
router.get('/failure', githubFailure);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * Create session before github redirect
 * @param req
 * @param res
 * @param next
 */
async function githubRedirectSession(req, res, next) {
   const tokenTmp = req.query.tokenTmp;

   // We need to have a temporary token to send a persistent token (it will be used at callback)
   if (!validateTokenTemporary(tokenTmp))
      return res.send('Authorization failed. No temporary token.');

   // Save temp token into user session
   req.session.tokenTmp = req.query.tokenTmp;

   next();
}

/**
 * Callback from OAuth server
 */
async function githubCallback(req, res) {
   // Successful authentication from OAuth server
   const tokenTmp = req.session.tokenTmp;
   const userID = req.user.id;
   const authID = req.user.authId;
   const authType = req.user.authType;

   // Destroy session
   req.session = null;

   // Get user permissions
   const permissionsView: object[] = await getManager().query(
      `SELECT * FROM view_user_permissions WHERE user_id=${req.user.id}`,
   );
   let permissionsPure: string[] = [];
   permissionsView.forEach((item: object) => {
      permissionsPure.push(item['permission_namespace'] + '.' + item['key_namespace']);
   });

   // Get user authority
   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);
   let user: UsersModel, isAuthority;
   try {
      user = await repoUsers.findOneOrFail({
         where: { id: req.user.id },
         relations: ['role'],
      });
      isAuthority = user.role.isAuthority;
   } catch (e) {}

   // Validate temporary token
   if (!validateTokenTemporary(tokenTmp)) return res.send('Sorry, no temporary token provided.');

   // Create permanent token and save it to db
   redisSetTokenIntoStorage(tokenTmp, userID, authID, authType, permissionsPure, isAuthority).then(
      () => {
         // Successful authorization
         res.send('Successful authorization, you can close this window.');
      },
   );
}

/**
 * Github OAuth failure
 * @param req
 * @param res
 */
async function githubFailure(req, res) {
   res.send('Github OAuth authorization failed. Unknown reason.');
}
