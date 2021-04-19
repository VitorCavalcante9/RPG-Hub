import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { RpgsRepository } from '../repositories/RpgsRepository';

class DicesController{
  async update(req: Request, res: Response){
    const { dices } = req.body;
    const { rpg_id: id } = req.params;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    const schema = yup.object().shape({
      dices: yup.array(yup.string()),
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }

    const currentRpgData = await rpgsRepository.findOne(id);

    const newRpgData = {
      ...currentRpgData,
      dices
    }

    try{
      await rpgsRepository.update(id, newRpgData);
    } catch {
      throw new AppError('RPG does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }
  
  async show(req: Request, res: Response){
    const { rpg_id: id } = req.params;

    const rpgsRepository = getCustomRepository(RpgsRepository);
    
    try{
      const rpg = await rpgsRepository.findOneOrFail(id);
      return res.json(rpg.dices);

    } catch {
      throw new AppError('RPG does not exists');
    }
  }
}

export default new DicesController();