import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import * as yup from 'yup';
import { ObjectsRepository } from '../repositories/ObjectsRepository';
import { DeleteFile } from '../services/deleteFile';
import ObjectView from '../views/objects_views';

interface Image {
  name: string,
  key: string,
  url: string
}

class ObjectController{
  async store(req: Request, res: Response){
    const { name } = req.body;
    const { rpg_id } = req.params;
    let image: Image;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      image = {
        name: requestIcon.originalname,
        key: requestIcon.key,
        url: requestIcon.location ? requestIcon.location : `${process.env.APP_URL}/${requestIcon.key}`,
      };
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }

    if(!image?.key) throw new AppError('Insira uma imagem');

    const objectItem = objectsRepository.create({
      name, rpg_id
    });

    await objectsRepository.save(objectItem);

    if(image?.key){
      await objectsRepository.insertImage(objectItem.id, image);
    }

    return res.status(201).json({ message: 'Object created successfully!'});
  }
  
  async show(req: Request, res: Response){
    const { id } = req.params;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    try{
      const objectItem = await objectsRepository.findOneOrFail(id, {
        relations: ['image']
      });
      return res.json(ObjectView.render(objectItem));

    } catch {
      throw new AppError('Object does not exists');
    }
  }
  
  async index(req: Request, res: Response){
    const { rpg_id } = req.params;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    try{
      const objects = await objectsRepository.find({ where: { rpg_id }, 
        relations: ['image']
      });

      return res.json(ObjectView.renderMany(objects));

    } catch {
      throw new AppError('Error');
    }
  }
  
  async update(req: Request, res: Response){
    const { name, previousImage } = req.body;
    const { id } = req.params;
    let image: Image;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      image = {
        name: requestIcon.originalname,
        key: requestIcon.key,
        url: requestIcon.location ? requestIcon.location : `${process.env.APP_URL}/${requestIcon.key}`,
      };
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }

    const currentObjectData = await objectsRepository.findOne(id);

    if(image?.key) {
      await objectsRepository.deleteImage(currentObjectData.id);
      await objectsRepository.insertImage(currentObjectData.id, image);
    }
    else if(!image?.key && !previousImage){
      await objectsRepository.deleteImage(currentObjectData.id);
    }

    const newObjectData = {
      ...currentObjectData,
      name
    }

    try{
      await objectsRepository.update(id, newObjectData);

    } catch {
      throw new AppError('Object does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }
  
  async delete(req: Request, res: Response){
    const { id } = req.params;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    try{
      await objectsRepository.deleteImage(Number(id));

      await objectsRepository.delete(id);
      return res.sendStatus(200);

    } catch {
      throw new AppError('Error');
    }
  }
}

export default new ObjectController();