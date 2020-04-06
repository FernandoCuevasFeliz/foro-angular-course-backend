import { Request, Response } from 'express';
import ModelUser, { UserI } from '../models/User';
import { isValidObjectId } from 'mongoose';
import fs from 'fs';
import path from 'path';

import { MaysPrimera } from '../helpers';
import { matchPassword, encrypthPassword } from '../libs/bcrypt';

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = {
    name: req.body.name.toLowerCase(),
    surname: req.body.surname.toLowerCase(),
  };
  const userReq: any = req.user;
  if (!userReq) {
    return res.status(400).json({
      status: 'error',
      msg: 'You do not have permissions for this action',
    });
  }
  const userUpdate: UserI = await ModelUser.findByIdAndUpdate(
    { _id: userReq.id },
    user,
    { new: true },
    (error) => {
      if (error) {
        return res.status(400).json({
          status: 'error',
          msg: 'An error occurred while updating the user, try again',
        });
      }
    }
  );
  userUpdate.name = MaysPrimera(userUpdate.name);
  userUpdate.surname = MaysPrimera(userUpdate.surname);
  return res.status(200).json({
    status: 'success',
    msg: 'User Updated!',
    user: userUpdate,
  });
};

//update password
export const updateEmail = async (req: Request, res: Response) => {
  const userReq: UserI = req.user;

  const user = {
    email: req.body.email.toLowerCase(),
  };
  if (!userReq) {
    return res.status(400).json({
      status: 'error',
      msg: 'You do not have permissions for this action',
    });
  }

  const userComp = await ModelUser.findOne({ email: user.email });

  if (userComp) {
    return res.status(400).json({
      status: 'error',
      msg: 'The email exist',
    });
  }
  const userCompPass: UserI = await ModelUser.findById({ _id: userReq.id });
  if (!userCompPass) {
    return res.status(404).json({
      status: 'error',
      msg: 'The user no exist',
    });
  }

  const isCorrect1 = await matchPassword(
    req.body.password,
    userCompPass.password
  );
  const isCorrect2 = await matchPassword(
    req.body.confirm_password,
    userCompPass.password
  );
  if (req.body.password != req.body.confirm_pasword) {
    return res.status(400).json({
      status: 'error',
      msg: 'The passwords are not match',
    });
  }
  if (
    (isCorrect1 && !isCorrect2) ||
    (!isCorrect1 && isCorrect2) ||
    (!isCorrect1 && !isCorrect2)
  ) {
    return res.status(400).json({
      status: 'error',
      msg: 'Incorrect Password',
    });
  }

  await ModelUser.findByIdAndUpdate(
    { _id: userReq.id },
    {
      email: user.email,
    },
    { new: true },
    (err, emailUpdate) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          msg: 'Error on server',
          err,
        });
      }
      if (!emailUpdate) {
        return res.status(400).json({
          status: 'error',
          msg: 'User no updated',
        });
      }
      return res.status(200).json({
        status: 'success',
        msg: 'User updated',
        user: emailUpdate,
      });
    }
  );
};

// getUser
export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user: UserI = await ModelUser.findById({ _id: req.params.id }).exec(
    (err, response) => {
      if (err) {
        return res.status(400).json({
          status: 'Error',
          msg: 'Error searching user',
        });
      } else if (!response) {
        return res.status(400).json({
          status: 'success',
          msg: 'The user does not exist',
        });
      }
    }
  );
  const data = {
    name: user.name,
    surname: user.surname,
    email: user.email,
    image: user.image,
    role: user.role,
  };
  return res.status(200).json({
    status: 'success',
    data,
  });
};

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userReq: UserI = req.user;
  const user: UserI = await ModelUser.findById({ _id: userReq.id });
  if (user.role == 'admin') {
    const users: UserI[] = await ModelUser.find((error, response) => {
      if (error) {
        return res.status(400).json({
          status: 'success',
          msg: 'Error searching users',
        });
      } else if (!response) {
        return res.status(400).json({
          status: 'success',
          msg: 'There are no registered users',
        });
      }
    });
    return res.status(200).json({
      status: 'success',
      users,
    });
  }
  return res.status(401).json({
    status: 'sucess',
    msg: 'You are not authorized to these routes',
  });
};
export const updatePassword = async (req: Request, res: Response) => {
  const user: any = req.user;
  const isCorrect1 = await matchPassword(req.body.password, user.password);

  if (!isCorrect1 || req.body.new_password != req.body.confirm_password) {
    return res.status(400).json({
      status: 'error',
      msg: 'Incorrect Password',
    });
  }
  const encrytPass = await encrypthPassword(req.body.new_password);
  const userPass = await ModelUser.findByIdAndUpdate(
    { _id: user.id },
    { password: encrytPass },
    (error) => {
      if (error) {
        return res.status(400).json({
          status: 'error',
          msg: 'An error occurred while saving the password, try again',
        });
      }
    }
  );

  return res.status(200).json({
    status: 'success',
    msg: 'Password Updated!',
    user: userPass,
  });
};

// avatar uploads
export const avatarUploads = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user: any = req.user;

  await ModelUser.findByIdAndUpdate(
    { _id: user.id },
    { image: req.file.filename },
    (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          msg: err,
        });
      }
    }
  );

  return res.status(200).json({
    status: 'success',
    msg: 'Imagen subida',
    file: req.user,
  });
};

//view images
export const getImages = async (req: Request, res: Response) => {
  const pathFile = './uploads/users/' + req.params.filename;
  fs.exists(pathFile, (exists) => {
    if (exists) {
      return res.sendFile(path.resolve(pathFile));
    } else {
      return res.status(404).json({
        status: 'success',
        msg: 'image no found',
      });
    }
  });
};
