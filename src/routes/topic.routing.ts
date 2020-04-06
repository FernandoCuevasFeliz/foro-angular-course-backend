import { Router } from 'express';

import {
  validateDataTopic,
  validateTopic,
} from '../middlewares/validator/validatorTopic';

import { autenticate } from '../middlewares/passport';
import {
  createTopic,
  getTopics,
  getTopicsByUser,
  getTopic,
  deleteTopic,
  upadateTopic,
  topicSearch,
  getMyTopics,
} from '../controllers/topic.controllers';

const router = Router();

router.post(
  '/topic',
  autenticate,
  validateDataTopic(),
  validateTopic,
  createTopic
);

router.get('/topic/:id', getTopic);

router.put(
  '/topic/:topic',
  autenticate,
  validateDataTopic(),
  validateTopic,
  upadateTopic
);

router.get('/topics/:page', getTopics);
router.get('/mytopics/:numPage', autenticate, getMyTopics);
router.get('/user/topics/:user/:page', getTopicsByUser);
router.delete('/user/topic/:topic', autenticate, deleteTopic);

router.get('/topics/search/:search', topicSearch);

export default router;
