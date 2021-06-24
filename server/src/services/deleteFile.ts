import path from 'path';
import fs from 'fs';
import aws from 'aws-sdk';

const s3 = new aws.S3();

export function DeleteFile(image: string){
  const pathFile = `${path.join(__dirname, '..', '..', 'tmp', 'uploads')}/${image}`;
  fs.unlink(pathFile, () => {});
}

export function DeleteS3File(key: string){
  return s3.deleteObject({
    Bucket: process.env.AWS_BUCKET,
    Key: key
  }).promise();
}