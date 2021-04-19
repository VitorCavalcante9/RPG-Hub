import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import * as yup from 'yup';
import { ObjectsRepository } from '../repositories/ObjectsRepository';
import { DeleteFile } from '../services/deleteFile';
import ObjectView from '../views/objects_views';

class ObjectController{
  async store(req: Request, res: Response){
    const { name } = req.body;
    const { rpg_id } = req.params;
    let image: any = null;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      image = requestIcon.filename;
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

    const objectItem = objectsRepository.create({
      name, rpg_id, image
    });

    await objectsRepository.save(objectItem);

    return res.status(201).json({ message: 'Object created successfully!'});
  }
  
  async show(req: Request, res: Response){
    const { id } = req.params;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    try{
      const objectItem = await objectsRepository.findOneOrFail(id);
      return res.json(ObjectView.render(objectItem));

    } catch {
      throw new AppError('Object does not exists');
    }
  }
  
  async index(req: Request, res: Response){
    const { rpg_id } = req.params;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    try{
      const objects = await objectsRepository.find({rpg_id});
      return res.json(ObjectView.renderMany(objects));

    } catch {
      throw new AppError('Error');
    }
  }
  
  async update(req: Request, res: Response){
    const { name } = req.body;
    const { id } = req.params;
    let image: any = null;
    const objectsRepository = getCustomRepository(ObjectsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      image = requestIcon.filename;
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

    DeleteFile(currentObjectData.image);

    const newObjectData = {
      ...currentObjectData,
      name,
      image
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
      const currentObject = await objectsRepository.findOne(id);
      DeleteFile(currentObject.image);

      await objectsRepository.delete(id);
      return res.sendStatus(200);

    } catch {
      throw new AppError('Error');
    }
  }
}

export default new ObjectController();