import { EntityRepository, getRepository, Repository } from 'typeorm';
import { ObjectItem } from '../models/Object';
import { Image } from '../models/Image';
import { DeleteFile, DeleteS3File } from '../services/deleteFile';

interface Icon {
  name: string,
  key: string,
  url: string
}

@EntityRepository(ObjectItem)
class ObjectsRepository extends Repository<ObjectItem> {
  async insertImage(object_id: number, { name, key, url }: Icon){
    const imageRepository = getRepository(Image);
    const verifyIfImageExists = await imageRepository.findOne({ object_id });

    if(verifyIfImageExists){

      const imageData = {
        ...verifyIfImageExists,
        name, key, url
      };
      await imageRepository.update(verifyIfImageExists.id, imageData);

    } else {

      const imageData = await imageRepository.create({
        object_id, name, key, url
      });
      const image = await imageRepository.save(imageData);

      return image;

    }

  }

  async deleteImage(object_id: number){
    const imageRepository = getRepository(Image);
    const image = await imageRepository.findOne({ object_id });

    if(image){
      if(image?.key){
        if(process.env.STORAGE_TYPE === 's3'){
          await DeleteS3File(image.key);
        } else {
          DeleteFile(image.key);
        }
      }

      const imageData = {
        object_id,
        name: '',
        key: '',
        url: ''
      }

      await imageRepository.update(image.id, imageData);
    }
  }
}

export { ObjectsRepository }