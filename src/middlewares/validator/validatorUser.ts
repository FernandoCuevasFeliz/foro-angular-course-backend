import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDataUser = () => {
  return [body('name').notEmpty(), body('surname').notEmpty()];
};

export const validateUser = (
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
