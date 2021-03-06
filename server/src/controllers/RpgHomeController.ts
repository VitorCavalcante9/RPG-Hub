import { json, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import { RpgParticipantsRepository } from '../repositories/RpgParticipantsRepository';
import { RpgsRepository } from '../repositories/RpgsRepository'
import { UsersRepository } from '../repositories/UsersRepository';

import RpgHomeView from '../views/rpgHome_views';

class RpgHomeController{
  async admin(req: Request, res: Response){
    const { rpg_id: id } = req.params;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    try{
      const rpg = await rpgsRepository.findOneOrFail(id, {
        relations: ['icon', 'characters', 'characters.icon', 'objects', 'objects.image', 'scenarios', 'scenarios.image', 'participants', 'participants.user', 'participants.user.icon']
      });
      return res.json(RpgHomeView.admin(rpg));

    } catch {
      throw new AppError('RPG does not exists');
    }
  }

  async participant(req: Request, res: Response){
    const rpgsParticipantRepository = getCustomRepository(RpgParticipantsRepository);
    
    const user_id = req.userId;
    const { rpg_id } = req.params;
    const rpgParticipant = await rpgsParticipantRepository.findOneOrFail({where:[
      { user_id, rpg_id }
    ],
      relations: ['rpg', 'rpg.icon', 'character', 'character.icon', 'character.permission', 'rpg.user', 'rpg.user.icon', 'rpg.participants', 'rpg.participants.user', 'rpg.participants.user.icon']
    });

    return res.json(RpgHomeView.participant(rpgParticipant));
  }
}

export default new RpgHomeController();