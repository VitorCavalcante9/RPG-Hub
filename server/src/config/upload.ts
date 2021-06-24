import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const storageTypes = {
  local: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'tmp', 'uploads'),
    filename:(request, file, cb) => {
      file.key = `${Date.now()}-${file.originalname}`;

      cb(null, file.key);
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const fileName=`${Date.now()}-${file.originalname}`;

      cb(null, fileName);
    }
  }) 
}

export default{
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
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