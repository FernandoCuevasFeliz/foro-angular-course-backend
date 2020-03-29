import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDataTopic = () => {
  return [
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('lang').notEmpty(),
  ];
};

export const validateTopic = (
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
