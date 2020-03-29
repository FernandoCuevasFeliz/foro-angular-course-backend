import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDataSignUp = () => {
  return [
    body('name')
      .isAlpha()
      .notEmpty(),
    body('surname')
      .isAlpha()
      .notEmpty(),
    body('email')
      .isEmail()
      .isLength({ min: 10 }),
    body('password')
      .isLength({ min: 6 })
      .notEmpty(),
    body('role')
      .isAlpha()
      .isLength({ min: 4 }),
  ];
};

export const validateSignUp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      msg: 'Please enter the data correctly',
      error: error.array(),
    });
  }

  return next();
};
