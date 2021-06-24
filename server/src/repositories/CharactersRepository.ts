import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Character } from '../models/Character';
import { Image } from '../models/Image';
import { DeleteFile, DeleteS3File } from '../services/deleteFile';

interface Icon {
  name: string,
  key: string,
  url: string
}

@EntityRepository(Character)
class CharactersRepository extends Repository<Character> {
  async insertImage(character_id: string, { name, key, url }: Icon){
    const imageRepository = getRepository(Image);
    const verifyIfImageExists = await imageRepository.findOne({ character_id });

    if(verifyIfImageExists){

      const imageData = {
        ...verifyIfImageExists,
        name, key, url
      };
      await imageRepository.update(verifyIfImageExists.id, imageData);

    } else {

      const imageData = await imageRepository.create({
        character_id, name, key, url
      });
      const image = await imageRepository.save(imageData);

      return image;

    }

  }

  async deleteImage(character_id: string){
    const imageRepository = getRepository(Image);
    const image = await imageRepository.findOne({ character_id });

    if(image){
      if(image?.key){
        if(process.env.STORAGE_TYPE === 's3'){
          await DeleteS3File(image.key);
        } else {
          DeleteFile(image.key);
        }
      }

      const imageData = {
        character_id,
        name: '',
        key: '',
        url: ''
      }

      await imageRepository.update(image.id, imageData);
    }
  }
}

export { CharactersRepository }