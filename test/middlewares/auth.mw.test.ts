import mwAuth from '@middlewares/auth.mw';
import { generateTokenJWT } from '@utils/tokens.util';
const sinon = require('sinon');

describe('authorization middleware', () => {
   describe('structure', () => {
      it('should be a function', () => {
         expect(typeof mwAuth).toBe('function');
      });

      it('should have 3 arguments', () => {
         expect(mwAuth.length).toBe(3);
      });
   });

   describe('functionality', () => {
      describe('free access', () => {
         it('should allow auth free access for ping', async () => {
            const req = {
               path: '/api/ping/auth/without',
            };
            const next = sinon.spy();

            mwAuth(req, {}, next);
            expect(next.calledOnce).toBeTruthy();
         });

         it('should allow auth free access for temporary token', async () => {
            const req = {
               path: '/api/token/temporary',
            };
            const next = sinon.spy();

            mwAuth(req, {}, next);
            expect(next.calledOnce).toBeTruthy();
         });

         it('should allow auth free access for persistent token', async () => {
            const req = {
               path: '/api/token/persistent',
            };
            const next = sinon.spy();

            mwAuth(req, {}, next);
            expect(next.calledOnce).toBeTruthy();
         });
      });

      describe('invalid', () => {
         it('should return 401 due to missing authorization header', async () => {
            const req = {
               path: '/',
            };
            const res = {
               status: () => res,
               json: json => {
                  expect(json).toHaveProperty('cod', 401);
                  expect(json).toHaveProperty('typ', 'error');
                  expect(json).toHaveProperty('msg');
               },
            };
            const next = sinon.spy();

            mwAuth(req, res, next);
            expect(next.notCalled).toBeTruthy();
         });

         it('should return 401 due to invalid JWT', async () => {
            const req = {
               path: '/',
               headers: {
                  authorization: 'iudhfudsfghdifgh.dfgdfg.sdfsdfg',
               },
            };
            const res = {
               status: () => res,
               json: json => {
                  expect(json).toHaveProperty('cod', 401);
                  expect(json).toHaveProperty('typ', 'error');
                  expect(json).toHaveProperty('msg');
               },
            };
            const next = sinon.spy();

            mwAuth(req, res, next);
            expect(next.notCalled).toBeTruthy();
         });
      });

      describe('success', () => {
         it('should call next', async () => {
            const req = {
               path: '/',
               headers: {
                  authorization: generateTokenJWT({ user_id: 0 }),
               },
            };
            const res = {
               status: () => res,
               json: json => json,
            };
            const next = sinon.spy();

            mwAuth(req, res, next);
            expect(req).toHaveProperty('jwt');
            expect(next.calledOnce).toBeTruthy();
         });
      });
   });
});
