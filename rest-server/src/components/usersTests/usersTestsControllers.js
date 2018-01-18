import {
    fetchAllUserTestsQuery
  } from './usersTestsQueries';
  import {
    success,
    error
  } from '../../lib/log';

  export const fetchAllUserTestsController = async (req, res) => {
    console.log('made it to testcontroller');
    try {
      const data = await fetchAllUserTestsQuery(req.params);
      success('fetchAllUserTestsController - successfully fetched all user test cases ', data);
      return res.status(200).send(data);
    } catch (err) {
      error('fetchAllUserTestsController - error= ', err);
    }
  }
  