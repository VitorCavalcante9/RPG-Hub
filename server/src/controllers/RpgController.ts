import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { RpgsRepository } from '../repositories/RpgsRepository';
import { NotesRepository } from '../repositories/NotesRepository';
import { DeleteFile } from '../services/deleteFile';

import RpgsView from '../views/rpgs_views';

class RpgController{
  async store(req: Request, res: Response){
    const { name } = req.body;
    let icon: any = null;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    const rpg = rpgsRepository.create({
      name,
      icon,
      user_id: req.userId,
      sheet: {
        status: [
          {
            name: 'Vida',
            color: '#CC0000',
            current: 100,
            limit: 100
          }
        ],
        skills: [],
        limitOfPoints: 0
      },
      dices: []
    });

    await rpgsRepository.save(rpg);

    const notesRepository = getCustomRepository(NotesRepository);
    const notes = await notesRepository.create({
      rpg_id: rpg.id,
      user_id: req.userId
    });

    await notesRepository.save(notes);

    return res.status(201).json({rpgId: rpg.id});
  }

  async show(req: Request, res: Response){
    const { rpg_id: id } = req.params;

    const rpgsRepository = getCustomRepository(RpgsRepository);
    
    try{
      const rpg = await rpgsRepository.findOneOrFail(id);
      return res.json(RpgsView.render(rpg));

    } catch {
      throw new AppError('RPG does not exists');
    }
  }

  async update(req: Request, res: Response){
    const { name, previousIcon } = req.body;
    const { rpg_id: id } = req.params;
    let icon: any = null;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    try{

      const currentRpgData = await rpgsRepository.findOne(id);

      if(icon) DeleteFile(currentRpgData.icon);
      else if(previousIcon){
        const fileName = previousIcon.split('uploads/');
        icon = fileName[1];
      }

      const newRpgData = {
        ...currentRpgData,
        name,
        icon
      }
    
      await rpgsRepository.update(id, newRpgData);

    } catch {
      throw new AppError('RPG does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }

  async delete(req: Request, res: Response){
    const rpgsRepository = getCustomRepository(RpgsRepository);
    const { rpg_id: id } = req.params;

    try{
      const currentRpgData = await rpgsRepository.findOne(id);
      DeleteFile(currentRpgData.icon);

      if(currentRpgData.scenarios) currentRpgData.scenarios.map(scenario => DeleteFile(scenario.image));
      if(currentRpgData.characters) currentRpgData.characters.map(character => DeleteFile(character.icon));
      if(currentRpgData.objects) currentRpgData.objects.map(object => DeleteFile(object.image));
      
      await rpgsRepository.delete(id);

      return res.json({message: 'RPG successFully deleted'});
    } catch(err) {
      throw new AppError(err.message);
    }
  }
  
}

export default new RpgController();