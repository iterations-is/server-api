import { generateTokenTemporary } from '@utils/generator.util';

describe('temporary token', () => {
   test('generate', () => {
      const tokenTmp = generateTokenTemporary();
      expect(typeof tokenTmp).toBe('string');
      expect(tokenTmp).toMatch(/^[abcdef0123456789]{77}$/);
   });
});
