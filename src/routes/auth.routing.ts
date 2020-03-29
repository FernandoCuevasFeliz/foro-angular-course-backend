import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth.controllers';

// importing validations
import {
  validateDataSignUp,
  validateSignUp,
} from '../middlewares/validator/validatorSignup';

import {
  validateDataSignIn,
  validateSignIn,
} from '../middlewares/validator/validatorSignin';
const router = Router();

router.post('/signup', validateDataSignUp(), validateSignUp, signUp);

router.post('/signin', validateDataSignIn(), validateSignIn, signIn);

export default router;
