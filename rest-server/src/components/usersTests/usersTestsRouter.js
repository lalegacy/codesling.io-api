import express from 'express';

import {
  fetchAllUserTestsController
} from './usersTestsControllers';

const router = express.Router();

router.route('/:challenge_id')
  .get(fetchAllUserTestsController);

export default router;
