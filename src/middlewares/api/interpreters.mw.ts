/**
 * @file Empty
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import axios from 'axios';

import GitHubSettings from '@config/oauth.config';
import { responseData } from '@utils/response.util';

export const mwGetInterpreters = async (req, res, next) => {
   try {
      let response = await axios.get(
         `https://api.github.com/repositories/181357697/contents/dist?client_id=${
            GitHubSettings.github.clientID
         }&client_secret=${GitHubSettings.github.clientSecret}`,
      );

      // Parse interpreters
      let interpreters = [];
      for (let interpreter of response.data) {
         interpreters.push({ name: interpreter.name });
      }

      return responseData(res, 200, 'Available interpreters', interpreters);
   } catch (e) {}

   return responseData(res, 400, 'Cannot get interpreters');
};
