import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { ScenariosRepository } from '../repositories/ScenariosRepository';
import { DeleteFile } from '../services/deleteFile';
import ScenarioView from '../views/scenarios_views';

class ScenarioController{
  async store(req: Request, res: Response){
    const { name } = req.body;
    const { rpg_id } = req.params;
    let image: any = null;
    const scenariosRepository = getCustomRepository(ScenariosRepository);

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
    
    if(!image) throw new AppError('Insira uma imagem');

    const scenario = scenariosRepository.create({
      name, rpg_id, image
    });

    await scenariosRepository.save(scenario);

    return res.status(201).json({ message: 'Scenario created successfully!'});
  }

  async show(req: Request, res: Response){
    const { id } = req.params;
    const scenariosRepository = getCustomRepository(ScenariosRepository);

    try{
      const scenario = await scenariosRepository.findOneOrFail(id);
      return res.json(ScenarioView.render(scenario));

    } catch {
      throw new AppError('Scenario does not exists');
    }
  }

  async index(req: Request, res: Response){
    const { rpg_id } = req.params;
    const scenariosRepository = getCustomRepository(ScenariosRepository);

    try{
      const scenarios = await scenariosRepository.find({rpg_id});
      return res.json(ScenarioView.renderMany(scenarios));

    } catch {
      throw new AppError('Error');
    }
  }

  async update(req: Request, res: Response){
    const { name, previousImage } = req.body;
    const { id } = req.params;
    let image: any = null;
    const scenariosRepository = getCustomRepository(ScenariosRepository);

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

    const currentScenarioData = await scenariosRepository.findOne(id);

    if(image) {
      DeleteFile(currentScenarioData.image);
    }
    else if(previousImage){
      const fileName = previousImage.split('uploads/');
      image = fileName[1];
    }

    const newScenarioData = {
      ...currentScenarioData,
      name,
      image
    }
    
    try{
      await scenariosRepository.update(id, newScenarioData);

    } catch {
      throw new AppError('Scenario does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }

  async delete(req: Request, res: Response){
    const scenariosRepository = getCustomRepository(ScenariosRepository);
    const { id } = req.params;

    try{
      const currentScenario = await scenariosRepository.findOne(id);
      DeleteFile(currentScenario.image);
      
      await scenariosRepository.delete(id);
      return res.sendStatus(200);

    } catch {
      throw new AppError('Error');
    }
  }
}

export default new ScenarioController();