import { Request, Response } from 'express';

import { matchPassword } from '../libs/bcrypt';
import { createToken } from '../libs/createToken';
import ModelUser from '../models/User';
import { MaysPrimera } from '../helpers';

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = {
    name: req.body.name.toLowerCase(),
    surname: req.body.surname.toLowerCase(),
    sex: req.body.sex.toLowerCase(),
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    image: req.body.image,
  };

  const userEmail = await ModelUser.findOne({ email: user.email });
  if (userEmail) {
    return res.status(400).json({
      status: 'error',
      msg: 'The User already Exists',
    });
  }

  if (user.sex == 'm') {
    user.image = 'img-male.png';
  } else if (user.sex == 'f') {
    user.image = 'img-female.png';
  }

  const newUser = new ModelUser(user);
  await newUser.save();

  const data = {
    _id: newUser.id,
    name: newUser.name,
    surname: newUser.surname,
    email: newUser.email,
    image: newUser.image,
    role: newUser.role,
    token: createToken(newUser),
  };
  data.name = MaysPrimera(data.name);
  data.surname = MaysPrimera(data.surname);
  return res.status(201).json(data);
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = await ModelUser.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res.status(400).json({
      status: 'error',
      msg: 'The email or password are incorrect',
    });
  }

  const isMatch = await matchPassword(req.body.password, user.password);
  if (isMatch) {
    const data = {
      _id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      image: user.image,
      role: user.role,
      token: createToken(user),
    };
    data.name = MaysPrimera(data.name);
    data.surname = MaysPrimera(data.surname);
    return res.status(200).json(data);
  }

  return res.status(400).json({
    status: 'error',
    msg: 'The email or password are incorrect',
  });
};
