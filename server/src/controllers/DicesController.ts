import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { RpgsRepository } from '../repositories/RpgsRepository';
import rollDices from '../utils/rollDices';

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

  async rollDice(req: Request, res: Response){
    const { dice, skill, bonus } = req.body;

    const schema = yup.object().shape({
      dice: yup.string().min(3).required('Dado inválido'),
      skill: yup.object({
        name: yup.string().min(3).required('Insira um nome válido'),
        value: yup.number().min(0).max(100).integer().required('Insira um valor válido'),
      }).nullable(),
      bonus: yup.number().integer().nullable()
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }
    const diceAndQuantity = dice.split('d');
    const quantity = Number(diceAndQuantity[0]);
    const diceMax = Number(diceAndQuantity[1]);

    let results = [];
    for(let i = 0; i < quantity; i++){
      results.push(rollDices(1, diceMax));
    }

    const sumResults = results.reduce((preVal, value) => {
      return preVal + value;
    }, 0)

    if(skill){
      let skillBonus = skill.value;
      if(bonus) skillBonus += bonus;

      let resultSkill = '';
      

      let extreme = Math.round(skillBonus/4);
      let good = Math.round(skillBonus/2);

      if(sumResults <= extreme) resultSkill = 'Extremo'
      else if (sumResults <= good) resultSkill = 'Bom'
      else if (sumResults <= skillBonus) resultSkill = 'Normal'
      else resultSkill = 'Falha'

      return res.json({ results, sumResults, resultSkill, skillName: skill.name, bonus })
    }

    return res.json({results, sumResults});
  }
}

export default new DicesController();