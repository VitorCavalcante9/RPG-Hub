import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../models/AppError';
import { PermissionChangeRepository } from '../repositories/PermissionChangesRepository';

import PermissionViews from '../views/permission_views';

class PermissionChangeController{
  async requestPermission(req: Request, res: Response){
    const { rpg_id, char_id } = req.params;
    const permissionRepository = getCustomRepository(PermissionChangeRepository);
    const verifyIfPermissionAlreadyExists = await permissionRepository.findOne({where:[{character_id: char_id}]});

    if(verifyIfPermissionAlreadyExists){
      throw new AppError('Permission has already been requested!');
    }

    const permission = permissionRepository.create({
      rpg_id, 
      character_id: char_id,
      permission: null
    });

    try{
      await permissionRepository.save(permission);
      return res.status(201).json({ message: 'Permission successfully requested!'});

    } catch(err){
      throw new AppError(err.message);
    }
  }

  async acceptPermission(req: Request, res: Response){
    const { id } = req.params;
    const permissionRepository = getCustomRepository(PermissionChangeRepository);

    try{
      const currentPermissionData = await permissionRepository.findOneOrFail(id);

      const newPermissionData = {
        ...currentPermissionData,
        permission: true
      }
      
      await permissionRepository.update(id, newPermissionData);

    } catch {
      throw new AppError('Permission Request does not exists');
    }

    return res.json({ message: 'Permission granted'});
  }

  async denyPermission(req: Request, res: Response){
    const { id } = req.params;
    const permissionRepository = getCustomRepository(PermissionChangeRepository);

    try{
      await permissionRepository.delete(id);
      return res.json({message: 'Permission denied'});

    } catch {
      throw new AppError('Error');
    }
  }

  async show(req: Request, res: Response){
    const { id } = req.params;
    const permissionRepository = getCustomRepository(PermissionChangeRepository);

    try{
      const permission = await permissionRepository.findOneOrFail(id, {
        relations: ['character', 'character.participant', 'character.participant.user']
      });
      return res.json(PermissionViews.render(permission));

    } catch {
      throw new AppError('Permission does not exists');
    }
  }

  async index(req: Request, res: Response){
    const { rpg_id } = req.params;
    const permissionRepository = getCustomRepository(PermissionChangeRepository);

    try{
      const permissions = await permissionRepository.find({where: [{rpg_id}], 
        relations: ['character', 'character.participant', 'character.participant.user']
      });
      
      if(permissions) return res.json(PermissionViews.renderMany(permissions));
      else return res.json(permissions)

    } catch(err) {
      if(err.message === "Cannot read property 'user_id' of null") return res.status(404).json({message: 'There are no permissions requested'});
      throw new AppError('Error');
    }
  }
}

export default new PermissionChangeController();