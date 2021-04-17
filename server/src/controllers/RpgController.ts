import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import { RpgsRepository } from '../repositories/RpgsRepository';
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

    const rpg = rpgsRepository.create({
      name,
      icon,
      user_id: req.userId,
      sheet: {},
      dices: []
    });

    await rpgsRepository.save(rpg);

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
    const { name } = req.body;
    const { rpg_id: id } = req.params;
    let icon: any = null;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
    }

    const currentRpgData = await rpgsRepository.findOne(id);

    DeleteFile(currentRpgData.icon);

    const newRpgData = {
      ...currentRpgData,
      name,
      icon
    }
    
    try{
      await rpgsRepository.update(id, newRpgData);
    } catch {
      throw new AppError('RPG does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }

  async delete(req: Request, res: Response){
    const rpgsRepository = getCustomRepository(RpgsRepository);
    const { rpg_id: id } = req.params;
    
    await rpgsRepository.delete(id);

    return res.sendStatus(200);
  }
}

export default new RpgController();