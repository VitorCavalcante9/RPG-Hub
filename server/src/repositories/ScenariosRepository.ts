import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Scenario } from '../models/Scenario';
import { Image } from '../models/Image';
import { DeleteFile, DeleteS3File } from '../services/deleteFile';

interface Icon {
  name: string,
  key: string,
  url: string
}

@EntityRepository(Scenario)
class ScenariosRepository extends Repository<Scenario> {
  async insertImage(scenario_id: number, { name, key, url }: Icon){
    const imageRepository = getRepository(Image);
    const verifyIfImageExists = await imageRepository.findOne({ scenario_id });

    if(verifyIfImageExists){

      const imageData = {
        ...verifyIfImageExists,
        name, key, url
      };
      await imageRepository.update(verifyIfImageExists.id, imageData);

    } else {

      const imageData = await imageRepository.create({
        scenario_id, name, key, url
      });
      const image = await imageRepository.save(imageData);

      return image;

    }

  }

  async deleteImage(scenario_id: number){
    const imageRepository = getRepository(Image);
    const image = await imageRepository.findOne({ scenario_id });

    if(image){
      if(image?.key){
        if(process.env.STORAGE_TYPE === 's3'){
          await DeleteS3File(image.key);
        } else {
          DeleteFile(image.key);
        }
      }

      const imageData = {
        scenario_id,
        name: '',
        key: '',
        url: ''
      }
      
      await imageRepository.update(image.id, imageData);
    }
  }
}

export { ScenariosRepository }