import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDataPassword = () => {
  return [
    body('password').notEmpty(),
    body('new_password').notEmpty().isLength({ min: 6 }),
    body('confirm_password').notEmpty().isLength({ min: 6 }),
  ];
};

export const validatePassword = (
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
