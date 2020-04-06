import ModelUser from '../../models/User';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
const secretKey = process.env.SECRET_KEY || 'estaesmipalabrasecreta';

const optsJwt: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

const JwtStrategy = new Strategy(optsJwt, async (payload, done) => {
  try {
    const user = await ModelUser.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.log('Error:', error);
  }
});

export const autenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pass = passport.authenticate(
    'jwt',
    { session: false },
    (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          status: 'error',
          msg: 'Error of authenticated',
        });
      }
      req.user = user;
      // console.log(user);

      // console.log(req.headers.authorization);
      return next();
    }
  )(req, res, next);
};

export default JwtStrategy;
