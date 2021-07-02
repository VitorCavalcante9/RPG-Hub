import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Image } from '../models/Image';
import { User } from '../models/User';
import { Rpg } from '../models/Rpg';
import { DeleteFile, DeleteS3File } from '../services/deleteFile';

interface Icon {
  name: string,
  key: string,
  url: string
}

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  async insertImage(user_id: string, { name, key, url }: Icon){
    const imageRepository = getRepository(Image);
    const verifyIfImageExists = await imageRepository.findOne({ user_id });

    if(verifyIfImageExists){

      const imageData = {
        ...verifyIfImageExists,
        name, key, url
      };
      await imageRepository.update(verifyIfImageExists.id, imageData);

    } else {

      const imageData = await imageRepository.create({
        user_id, name, key, url
      });
      const image = await imageRepository.save(imageData);

      return image;

    }

  }

  async getImage(user_id: string){
    const imageRepository = getRepository(Image);
    const icon = await imageRepository.findOne({ user_id });

    return icon;
  }

  async deleteImage(user_id: string){
    const imageRepository = getRepository(Image);
    const image = await imageRepository.findOne({ user_id });

    if(image){
      if(image?.key){
        if(process.env.STORAGE_TYPE === 's3'){
          await DeleteS3File(image.key);
        } else {
          DeleteFile(image.key);
        }
      }

      const imageData = {
        user_id,
        name: '',
        key: '',
        url: ''
      }

      await imageRepository.update(image.id, imageData);
    }
  }

  async deleteRelationsImages(rpgs: Rpg[]){
    const imageRepository = getRepository(Image);
    let images: Image[] = [];

    rpgs.map(rpg => {
      rpg.characters.map(character => {
        images.push(character.icon)
      });

      rpg.scenarios.map(scenario => {
        images.push(scenario.image)
      });

      rpg.objects.map(object => {
        images.push(object.image)
      });

      images.push(rpg.icon)
    })

    await imageRepository.remove(images);
  }
}

export { UsersRepository }