import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const destino = './uploads/users';

const upload = multer({
  // storage
  storage: multer.diskStorage({
    destination: destino,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
  }),

  // limits
  limits: {
    fileSize: 2000000,
  },

  // file filter
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error('File type error.'));
    }
    return cb(null, true);
  },
}).single('avatar');

export const uploadsAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        status: 'error',
        msg: 'Image upload failed, try another',
        error: error,
      });
    } else if (error instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'error',
        msg: 'Error loading multer',
        error: multer.MulterError,
      });
    } else if (!req.file) {
      return res.status(404).json({
        status: 'error',
        msg: 'No image or file has been sent',
      });
    }

    next();
  });
};

export default uploadsAvatar;
