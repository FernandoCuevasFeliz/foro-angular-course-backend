import { Router, Request, Response } from 'express';
import passport from 'passport';
const router = Router();

router.get(
  '/profile',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req: Request, res: Response) => {
    res.send('Bienvenido desde la ruta segura');
  }
);

export default router;
