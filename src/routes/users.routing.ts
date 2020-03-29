import { Router } from 'express';
const router = Router();
import {
  updateUser,
  updatePassword,
  avatarUploads,
  getImages,
  getUser,
  getUsers,
} from '../controllers/user.controllers';
import upload from '../middlewares/multiparty/avatar';
import { autenticate } from '../middlewares/passport';

router.put('/update/user', autenticate, updateUser);

router.put('/updatePassword', autenticate, updatePassword);

router.post('/image/avatar', autenticate, upload, avatarUploads);
router.get('/image/avatar/:filename', autenticate, getImages);

router.get('/user/:id', autenticate, getUser);
router.get('/users', autenticate, getUsers);

export default router;
