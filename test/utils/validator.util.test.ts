import { validateTokenTemporary, validateViaJoiSchema } from '@utils/validator.util';
const joi = require('joi');

describe('temporary token', () => {
   test('too short', () => {
      expect(
         validateTokenTemporary(
            '0000000000000000000000000000000000000000000000000000000000000000000000000000',
         ),
      ).toBe(false);
   });

   test('too long', () => {
      expect(
         validateTokenTemporary(
            '000000000000000000000000000000000000000000000000000000000000000000000000000000',
         ),
      ).toBe(false);
   });

   test('invalid symbol', () => {
      expect(
         validateTokenTemporary(
            '0000000000000000000000000000000000000000000000000000000000000000000000000000x',
         ),
      ).toBe(false);
   });

   test('valid', () => {
      expect(
         validateTokenTemporary(
            '2a85ae5aced876337b73c36c51604b47cd08251627e4e54220f6440c52b320531553706608925',
         ),
      ).toBe(true);
   });
});

describe('joi schema', () => {
   test('invalid', () => {
      const object = {
         id: 5,
         name: 'Charlotte White',
      };
      const schema = {
         id: joi.number().required(),
         name: joi.string().required(),
         username: joi.string().required(),
      };
      expect(validateViaJoiSchema(object, schema)).toBe(false);
   });

   test('valid', () => {
      const object = {
         id: 5,
         name: 'Charlotte White',
         username: 'charlotte',
      };
      const schema = {
         id: joi.number().required(),
         name: joi.string().required(),
         username: joi.string().required(),
      };
      expect(validateViaJoiSchema(object, schema)).toBe(true);
   });
});
