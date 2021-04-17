import path from 'path';
import fs from 'fs'

export function DeleteFile(image: string){
  const pathFile = `${path.join(__dirname, '..', '..', 'uploads')}/${image}`;
  fs.unlink(pathFile, () => {});
}