import { Router } from 'express';

import {
  createComment,
  deleteComment,
  updateComment,
} from '../controllers/commet.controllers';

import {
  validateDataComment,
  validateComment,
} from '../middlewares/validator/validatorComment';
import { autenticate } from '../middlewares/passport';

const router = Router();

router.post(
  '/comment/topic/:topic',
  validateDataComment(),
  validateComment,
  autenticate,
  createComment
);

router.put(
  '/comment/:comment',
  validateDataComment(),
  validateComment,
  autenticate,
  updateComment
);

router.delete('/comment/:comment', autenticate, deleteComment);

export default router;
