import multer from 'multer';
import path from 'path';

export default{
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename:(request, file, cb) => {
      const fileName=`${Date.now()}-${file.originalname}`;

      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];

    if(allowedMimes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
}