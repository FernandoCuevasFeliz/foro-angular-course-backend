import { Router } from 'express';
const router = Router();
import {
  updateUser,
  updatePassword,
  avatarUploads,
  getImages,
  getUser,
  getUsers,
  updateEmail,
} from '../controllers/user.controllers';
import upload from '../middlewares/multiparty/avatar';
import { autenticate } from '../middlewares/passport';
import {
  validateDataUser,
  validateUser,
} from '../middlewares/validator/validatorUser';
import {
  validateDataPassword,
  validatePassword,
} from '../middlewares/validator/validatorPassword';
import {
  validateDataEmail,
  validateEmail,
} from '../middlewares/validator/validatorEmail';

router.put(
  '/update/user',
  validateDataUser(),
  validateUser,
  autenticate,
  updateUser
);

router.put(
  '/user/update/password',
  validateDataPassword(),
  validatePassword,
  autenticate,
  updatePassword
);

router.put(
  '/user/update/email',
  validateDataEmail(),
  validateEmail,
  autenticate,
  updateEmail
);

router.post('/image/avatar', autenticate, upload, avatarUploads);
router.get('/image/avatar/:filename', getImages);

router.get('/user/:id', autenticate, getUser);
router.get('/users', autenticate, getUsers);

export default router;
