import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../models/AppError';
import { RpgParticipantsRepository } from '../repositories/RpgParticipantsRepository';
import { NotesRepository } from '../repositories/NotesRepository';

class InviteController{
  async acceptInvite(req: Request, res: Response){
    const { rpg_id } = req.body;
    const user_id = req.userId;

    const schema = yup.object().shape({
      rpg_id: yup.string().length(36, 'Insira um código válido').required('Insira um id válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    const rpgsParticipantRepository = getCustomRepository(RpgParticipantsRepository);

    const usersAlreadyExistsInRPG = await rpgsParticipantRepository.findOne({where:[{user_id, rpg_id}]});

    if(usersAlreadyExistsInRPG){
      throw new AppError('You already entered this RPG!');
    }

    try{
      const rpgParticipant = rpgsParticipantRepository.create({
        user_id, rpg_id
      });
  
      const newRpgParticipant = await rpgsParticipantRepository.save(rpgParticipant);

      const notesRepository = getCustomRepository(NotesRepository);
      const notes = await notesRepository.create({
        user_id, 
        rpg_id,
        rpg_participant_id: newRpgParticipant.id
      });

      await notesRepository.save(notes);

      return res.status(201).json({message: 'Successfully inserted!'});

    } catch(err) {
      throw new AppError(err.message);
    }
  }

  async removeUser(req: Request, res: Response){
    const { rpg_id } = req.params;
    const { user_id } = req.body;
    
    const rpgsParticipantRepository = getCustomRepository(RpgParticipantsRepository);
    
    try{
      const rpgParticipant = await rpgsParticipantRepository.findOne({where:[{user_id, rpg_id}]});
      await rpgsParticipantRepository.delete(rpgParticipant.id);

      return res.json({message: 'User successfully removed!'});

    } catch(err) {
      throw new AppError(err.message);
    }
  }
}

export default new InviteController();