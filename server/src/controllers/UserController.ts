import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';

import { AppError } from '../models/AppError';
import { UsersRepository } from '../repositories/UsersRepository';
import UsersView from '../views/users_view';

interface Icon {
  name: string,
  key: string,
  url: string
}

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
    const user = await usersRepository.findOne(id, {
      relations: ['icon']
    });

    return res.json(UsersView.render(user));
  }

  async update(req: Request, res: Response){
    const { username, previousIcon } = req.body;
    let icon: Icon;

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = {
        name: requestIcon.originalname,
        key: requestIcon.key,
        url: requestIcon.location ? requestIcon.location : `${process.env.APP_URL}/${requestIcon.key}`,
      };
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

    try{

      const currentUserData = await usersRepository.findOneOrFail(id);

      if(icon?.key) {
        await usersRepository.deleteImage(id);
        await usersRepository.insertImage(id, icon);
      }
      else if(!icon?.key && !previousIcon){
        await usersRepository.deleteImage(id);
      }
      else if(previousIcon){
        const image = await usersRepository.getImage(id);

        icon = {
          name: image.name,
          key: image.key,
          url: image.url
        }
      }

      const newUserData = {
        ...currentUserData,
        username
      }

      await usersRepository.update(id, newUserData);

      return res.status(200).json(UsersView.minRender(username, icon));
      
    } catch(err) {
      console.log(err)
      throw new AppError(err.message);
    }
  }

  async updatePassword(req: Request, res: Response){
    const { password, newPassword } = req.body;

    const schema = yup.object().shape({
      password: yup.string().min(4).required('Senha inválida'),
      newPassword: yup.string().min(4).required('Senha inválida')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    const usersRepository = getCustomRepository(UsersRepository);
    const id = req.userId;

    try{
      const currentUserData = await usersRepository.findOne(id);

      const isValidPassword = await bcrypt.compare(password, currentUserData.password);
      if(!isValidPassword){
        throw new AppError('Senha atual incorreta');
      }

      const hashPassword = bcrypt.hashSync(newPassword, 8);
      
      const newUserData = {
        ...currentUserData,
        password: hashPassword
      }

      await usersRepository.update(id, newUserData);

      return res.json({message: 'Successfully updated!'});
      
    } catch(err) {
      throw new AppError(err.message);
    }
  }

  async delete(req: Request, res: Response){
    const usersRepository = getCustomRepository(UsersRepository);
    
    const id = req.userId;

    try{
      const currentUser = await usersRepository.findOne(id, {
        relations: ['rpgs', 'rpgs.icon', 'rpgs.characters', 'rpgs.characters.icon', 'rpgs.scenarios', 'rpgs.scenarios.image', 'rpgs.objects', 'rpgs.objects.image']
      });
      await usersRepository.deleteImage(id);

      if(currentUser.rpgs){
        await usersRepository.deleteRelationsImages(currentUser.rpgs);
      }

      await usersRepository.delete(id);

      return res.sendStatus(200);
    } catch(err) {
      throw new AppError(err.message);
    }
  }
}

export default new UserController();