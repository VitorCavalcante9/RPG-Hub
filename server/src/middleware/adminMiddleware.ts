import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

export default async function adminMiddleware(
  req: Request, res: Response, next: NextFunction
){
  const id = req.userId;
  const { rpg_id } = req.params;
  const usersRepository = getCustomRepository(UsersRepository);  

  try{
    const user = await usersRepository.findOneOrFail(id, {
      relations: ['rpgs']
    });
  
    let isAdmin = false;
    user.rpgs.map(rpg => {
      if(rpg.id === rpg_id) isAdmin = true;
    })
  
    if(isAdmin) return next();
    else return res.status(401).json({message: 'Você não é admin deste RPG'});
  } catch(error) {
    console.error(error)
    return res.sendStatus(401);
  }
}