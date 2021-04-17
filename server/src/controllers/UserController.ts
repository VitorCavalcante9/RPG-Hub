import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { AppError } from '../models/AppError';
import { UsersRepository } from '../repositories/UsersRepository';
import UsersView from '../views/users_view';
import { DeleteFile } from '../services/deleteFile';

class UserController{
  async store(req: Request, res: Response){
    const { username, email, password } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const usersAlreadyExists = await usersRepository.findOne({email});

    if(usersAlreadyExists){
      throw new AppError('User already exists!');
    }

    const user = usersRepository.create({
      username, email, password
    })

    await usersRepository.save(user);

    return res.status(201).json(user);
  }

  async show(req: Request, res: Response){    
    const usersRepository = getCustomRepository(UsersRepository);
    
    const id = req.userId;
    const user = await usersRepository.findOne({id});

    return res.json(UsersView.render(user));
  }

  async update(req: Request, res: Response){
    const { username } = req.body;
    let icon: any = null;
    const usersRepository = getCustomRepository(UsersRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
    }
    
    const id = req.userId;
    
    const currentUserData = await usersRepository.findOne({id});

    DeleteFile(currentUserData.icon);

    const newUserData = {
      ...currentUserData,
      username,
      icon
    }

    try{
      await usersRepository.update(id, newUserData);
    } catch {
      throw new AppError('Error updating');
    }

    return res.status(200).json({ message: 'Successfully updated!'});
  }

  async delete(req: Request, res: Response){
    const usersRepository = getCustomRepository(UsersRepository);
    
    const id = req.userId;

    await usersRepository.delete(id);

    return res.sendStatus(200);
  }
}

export default new UserController();