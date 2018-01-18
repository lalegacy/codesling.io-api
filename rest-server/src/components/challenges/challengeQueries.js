import db from '../../config/database';
import {
  addChallengeHelper
} from './challengeSQLHelpers';
import {
  success,
  error
} from '../../lib/log';

export const addChallengeQuery = async (body) => {
  try {
    const queryString = addChallengeHelper(body);
    console.log('queryString: ', queryString);
    const data = await db.queryAsync(queryString);
    console.log('data: ', data);
    success('addChallengeQuery - successfully added challenge ', data);
    return data;
  } catch (err) {
    error('addChallengeQuery - error= ', err);
  }
};
