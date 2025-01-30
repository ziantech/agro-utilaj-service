import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';


const storage = multer.memoryStorage();


const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG and PNG formats are allowed'));
  }
  cb(null, true);
};


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 20, 
  },
}).array('images', 20); 


export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }


    req.body.images = req.files as Express.Multer.File[];

    next();
  });
};
