import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { AppError } from '../models/AppError';
import UsersView from '../views/users_view';

class AuthController{
  async authenticate(request: Request, response: Response){
    const usersRepository = getCustomRepository(UsersRepository);
    const { email, password } = request.body;
    
    const user = await usersRepository.findOne({ where: { email }, relations: ['icon'] });

    if(!user){
      return response.status(401).json({message: 'Usuário e/ou senha inválidos'});
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      throw new AppError('Invalid Password');
    }

    const token = jwt.sign({ id: user.id }, process.env.APP_KEY, { expiresIn: '7d' });

    return response.json(UsersView.authRender(user, token));
  }
}

export default new AuthController();