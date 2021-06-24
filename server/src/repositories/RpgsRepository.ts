import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Rpg } from '../models/Rpg';
import { Image } from '../models/Image';
import { DeleteFile, DeleteS3File } from '../services/deleteFile';

interface Icon {
  name: string,
  key: string,
  url: string
}

@EntityRepository(Rpg)
class RpgsRepository extends Repository<Rpg> {
  async insertImage(rpg_id: string, { name, key, url }: Icon){
    const imageRepository = getRepository(Image);
    const verifyIfImageExists = await imageRepository.findOne({ rpg_id });

    if(verifyIfImageExists){

      const imageData = {
        ...verifyIfImageExists,
        name, key, url
      };
      await imageRepository.update(verifyIfImageExists.id, imageData);

    } else {

      const imageData = await imageRepository.create({
        rpg_id, name, key, url
      });
      const image = await imageRepository.save(imageData);

      return image;

    }

  }

  async deleteImage(rpg_id: string){
    const imageRepository = getRepository(Image);
    const image = await imageRepository.findOne({ rpg_id });

    if(image){
      if(image?.key){
        if(process.env.STORAGE_TYPE === 's3'){
          await DeleteS3File(image.key);
        } else {
          DeleteFile(image.key);
        }
      }

      const imageData = {
        rpg_id,
        name: '',
        key: '',
        url: ''
      }

      await imageRepository.update(image.id, imageData);
    }
  }

  async deleteRelationsImages(rpg: Rpg){
    const imageRepository = getRepository(Image);
    let images: Image[] = [];

    images.push(rpg.icon);

    rpg.characters.map(character => {
      images.push(character.icon)
    });

    rpg.scenarios.map(scenario => {
      images.push(scenario.image)
    });

    rpg.objects.map(object => {
      images.push(object.image)
    });

    await imageRepository.remove(images);
  }
}

export { RpgsRepository }