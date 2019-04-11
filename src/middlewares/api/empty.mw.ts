/**
 * @file Empty
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { responseSimple } from '@utils/response.util';

export const mwEmpty = async (req, res, next) => {
   return responseSimple(res, 200, 'Empty.');
};
