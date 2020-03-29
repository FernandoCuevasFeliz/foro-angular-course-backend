import jwt from 'jsonwebtoken';
import moment from 'moment';
moment().format();

import { UserI } from '../models/User';
const secretKey = process.env.SECRET_KEY || 'estaesmipalabrasecreta';

export function createToken(user: UserI) {
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, secretKey, {
    expiresIn: moment()
      .add(1, 'day')
      .unix(),
  });

  return token;
}
