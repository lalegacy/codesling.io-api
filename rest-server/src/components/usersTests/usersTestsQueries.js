import db from '../../config/database';

import {
  fetchAllUserTestsHelper
} from './usersTestsSQLHelpers';
import {
  success,
  error
} from '../../lib/log';

export const fetchAllUserTestsQuery = async (params) => {
    try {
      const queryString = fetchAllUserTestsHelper(params);
      const data = await db.queryAsync(queryString);
      success('fetchUserTesgsQuery - successfully fetched all user test cases ', data);
      return data;
    } catch (err) {
      error('fetchUserTestsQuery - error= ', err);
    }
  };
  