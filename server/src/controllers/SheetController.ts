import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import { RpgsRepository } from '../repositories/RpgsRepository';

class SheetController{
  async update(req: Request, res: Response){
    const { status, skills, limitOfPoints } = req.body;
    const { rpg_id: id } = req.params;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    const currentRpgData = await rpgsRepository.findOne(id);

    const newRpgData = {
      ...currentRpgData,
      sheet: {
        status,
        skills,
        limitOfPoints
      }
    }

    try{
      await rpgsRepository.update(id, newRpgData);
    } catch {
      throw new AppError('RPG does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }
}

export default new SheetController();