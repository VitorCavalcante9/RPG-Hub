import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { RpgsRepository } from '../repositories/RpgsRepository';

class SheetController{
  async update(req: Request, res: Response){
    const { status, skills, limitOfPoints } = req.body;
    const { rpg_id: id } = req.params;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    const schema = yup.object().shape({
      status: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        color: yup.string().min(3).max(7).required('Insira uma cor válida'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      })),
      skills: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      })),
      limitOfPoints: yup.number().integer().min(0).required('Insira um limite de pontos válido')
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

  async show(req: Request, res: Response){
    const { rpg_id: id } = req.params;

    const rpgsRepository = getCustomRepository(RpgsRepository);
    
    try{
      const rpg = await rpgsRepository.findOneOrFail(id);
      return res.json(rpg.sheet);

    } catch {
      throw new AppError('RPG does not exists');
    }
  }
}

export default new SheetController();