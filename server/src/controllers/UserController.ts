import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../models/AppError';
import { UsersRepository } from '../repositories/UsersRepository';
import UsersView from '../views/users_view';
import { DeleteFile } from '../services/deleteFile';

class UserController{
  async store(req: Request, res: Response){
    const { username, email, password } = req.body;

    const schema = yup.object().shape({
      username: yup.string().min(3).max(50).required('Insira um nome válido'),
      email: yup.string().email().required('Email inválido'),
      password: yup.string().min(4).required('Senha inválida'),
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

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

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
    }

    const schema = yup.object().shape({
      username: yup.string().min(3).max(50).required('Insira um nome válido')   
    });

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const id = req.userId;
    
    const currentUserData = await usersRepository.findOne(id);

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

    try{
      const currentUser = await usersRepository.findOne(id);
      DeleteFile(currentUser.icon);

      await usersRepository.delete(id);

      return res.sendStatus(200);
    } catch(err) {
      throw new AppError(err.message);
    }
  }
}

export default new UserController();