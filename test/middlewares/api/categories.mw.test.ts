import { createTypeormConnection } from '@utils/typeorm.util';
import { mwCreateProjectCategory } from '@middlewares/api/categories.mw';

const sinon = require('sinon');

let connection;

beforeAll(async () => {
   connection = await createTypeormConnection();
});

afterAll(async () => {
   // await connection.close();
});

describe('Middleware / Project Categories', () => {
   test('get all categories', async () => {
      const req = {
         body: {
            name: 'Example category',
         },
         params: null,
      };
      const res = {
         status: () => res,
         json: json => {
            expect(json).toHaveProperty('cod', 200);
            expect(json).toHaveProperty('typ', 'success');
            expect(json).toHaveProperty('msg', 'Category was created.');
            expect(json).toHaveProperty('dat.name', 'Example category');
         },
      };
      const next = sinon.spy();
      await mwCreateProjectCategory(req, res, next);
   });
});
