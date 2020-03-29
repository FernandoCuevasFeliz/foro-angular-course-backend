import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDataSignIn = () => {
  return [
    body('email')
      .isEmail()
      .isLength({ min: 10 })
      .notEmpty(),
    body('password')
      .isLength({ min: 6 })
      .notEmpty(),
  ];
};

export const validateSignIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      msg: 'Incorrect username or password',
      error: error.array(),
    });
  }

  return next();
};
