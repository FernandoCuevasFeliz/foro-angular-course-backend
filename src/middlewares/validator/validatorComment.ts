import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDataComment = () => {
  return [body('content').notEmpty()];
};

export const validateComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      msg: 'Incorrect Data',
      error: error.array(),
    });
  }

  return next();
};
