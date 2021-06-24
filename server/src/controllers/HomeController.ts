import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import { UsersRepository } from '../repositories/UsersRepository';
import HomeView from '../views/home_view';

class HomeController{
  async home(req: Request, res: Response){
    const usersRepository = getCustomRepository(UsersRepository);
    const id = req.userId;

    try{
      const user = await usersRepository.findOne(id, {
        relations: ['rpgs', 'rpgs.icon', 'rpgs_participant', 'rpgs_participant.rpg', 'rpgs_participant.rpg.icon']
      });
  
      return res.json(HomeView.render(user));
    } catch(err) {
      console.error(err)
      throw new AppError(err.message);
    }
  }
}

export default new HomeController();