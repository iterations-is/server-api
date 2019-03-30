import mwCORS from '@middlewares/cors.mw';
const sinon = require('sinon');

describe('cors middleware', () => {
   describe('structure', () => {
      it('should be a function', () => {
         expect(typeof mwCORS).toBe('function');
      });

      it('should have 3 arguments', () => {
         expect(mwCORS.length).toBe(3);
      });
   });

   describe('functionality', () => {
      it('should run next() if method !== OPTIONS', async () => {
         const req = {
            method: '',
         };
         const res = {
            header: () => res,
            status: () => res,
            end: () => res,
         };
         const next = sinon.spy();

         mwCORS(req, res, next);
         expect(next.calledOnce).toBeTruthy();
      });

      it('should end result if method === OPTIONS', async () => {
         const req = {
            method: 'OPTIONS',
         };
         const res = {
            header: () => res,
            status: () => res,
            end: sinon.spy(),
         };
         const next = sinon.spy();

         mwCORS(req, res, next);
         expect(next.notCalled).toBeTruthy();
         expect(res.end.calledOnce).toBeTruthy();
      });
   });
});
