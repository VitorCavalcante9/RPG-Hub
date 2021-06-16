import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { CharactersRepository } from '../repositories/CharactersRepository';
import { PermissionChangeRepository } from '../repositories/PermissionChangesRepository';
import { RpgParticipantsRepository } from '../repositories/RpgParticipantsRepository';
import { DeleteFile } from '../services/deleteFile';
import CharacterView from '../views/characters_views';
import imageApi from '../services/imageApi';

class CharacterController{
  async store(req: Request, res: Response){
    const { name, inventory, status, skills, limitOfPoints } = req.body;
    const { rpg_id } = req.params;
    let icon: any = null;
    const charactersRepository = getCustomRepository(CharactersRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
      imageApi.post('/', { name: icon })
        .then(() => DeleteFile(icon))
        .catch(err => console.log(err.response.data));
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido'),
      inventory: yup.array(yup.string()),
      status: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        color: yup.string().min(3).max(7).required('Insira uma cor válida'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      })),
      skills: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      })),
      limitOfPoints: yup.number().min(0).integer().required('Insira um valor válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }

    const character = charactersRepository.create({
      name, 
      rpg_id, 
      icon, 
      inventory: JSON.parse(inventory), 
      status: JSON.parse(status), 
      skills: JSON.parse(skills),
      limitOfPoints
    });

    try{
      const newCharacter = await charactersRepository.save(character);

      const permissionRepository = getCustomRepository(PermissionChangeRepository);

      const permission = permissionRepository.create({
        rpg_id, 
        character_id: newCharacter.id,
        permission: true
      });
      await permissionRepository.save(permission);

      return res.status(201).json({ id: character.id, message: 'Character created successfully!'});

    } catch(err){
      throw new AppError(err.message);
    }

  }

  async show(req: Request, res: Response){
    const { id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try{
      const character = await charactersRepository.findOneOrFail(id, {
        relations: ['participant', 'participant.user']
      });
      return res.json(CharacterView.render(character));

    } catch {
      throw new AppError('Character does not exists');
    }
  }

  async index(req: Request, res: Response){
    const { rpg_id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try{
      const character = await charactersRepository.find({where: [{rpg_id}], 
        relations: ['participant', 'participant.user']
      });
      return res.json(CharacterView.renderMany(character));

    } catch {
      throw new AppError('Error');
    }
  }

  async update(req: Request, res: Response){
    const { name, previousIcon, inventory, status, skills, limitOfPoints } = req.body;
    const { id } = req.params;
    let icon: any = null;
    const charactersRepository = getCustomRepository(CharactersRepository);

    if(req.file){
      const requestIcon = req.file as Express.Multer.File;
      icon = requestIcon.filename;
      imageApi.post('/', { name: icon })
        .then(() => DeleteFile(icon))
        .catch(err => console.log(err.response.data));
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido'),
      previousIcon: yup.string(),
      inventory: yup.array(yup.string()),
      status: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        color: yup.string().min(3).max(7).required('Insira uma cor válida'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      })),
      skills: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      })),
      limitOfPoints: yup.number().min(0).integer().required('Insira um valor válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }

    const currentCharacterData = await charactersRepository.findOne(id);

    if(icon) { 
      DeleteFile(currentCharacterData.icon);
      imageApi.delete('/', { data: { name: currentCharacterData.icon } })
        .then().catch(err => console.log(err.response.data));
    }
    else if(previousIcon){
      const fileName = previousIcon.split('uploads/');
      icon = fileName[1];
    }

    const newCharacterData = {
      ...currentCharacterData,
      name, 
      icon, 
      inventory: JSON.parse(inventory), 
      status: JSON.parse(status), 
      skills: JSON.parse(skills),
      limitOfPoints
    }

    try{
      await charactersRepository.update(id, newCharacterData);

    } catch {
      throw new AppError('Character does not exists');
    }

    return res.json({ message: 'Successfully updated!'});

  }

  async updateUser(req: Request, res: Response){
    const { skills: new_skills } = req.body;
    const { id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);
    
    const schema = yup.object().shape({
      skills: yup.array(yup.object({
        name: yup.string().required('Insira um nome válido'),
        current: yup.number().min(0).integer().required('Insira um valor válido'),
        limit: yup.number().min(0).integer().required('Insira um valor válido')
      }))
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      console.error(err)
      throw new AppError(err.errors);
    }

    const currentCharacterData = await charactersRepository.findOne(id, {
      relations: ['permission']
    });
    const permission = currentCharacterData.permission;
    delete currentCharacterData.permission;

    const skills = new_skills ? new_skills : currentCharacterData.skills;

    const newCharacterData = {
      ...currentCharacterData,
      skills
    }

    try{
      await charactersRepository.update(id, newCharacterData);

      const permissionRepository = getCustomRepository(PermissionChangeRepository);

      await permissionRepository.delete(permission.id);

    } catch(err) {
      console.error(err)
      throw new AppError('Character does not exists');
    }

    return res.json({ message: 'Successfully updated!'});
  }

  async delete(req: Request, res: Response){
    const { rpg_id, id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try{
      const currentCharacter = await charactersRepository.findOne(id);

      const rpgsParticipantRepository = getCustomRepository(RpgParticipantsRepository);
      const currentRpgPartData = await rpgsParticipantRepository.findOne(
        { where:[{ character_id: id, rpg_id }] }
      );

      if(currentRpgPartData){
        const newRpgPartData = {
          ...currentRpgPartData,
          character_id: null
        }
        await rpgsParticipantRepository.update(currentRpgPartData.id, newRpgPartData);
      }
      
      DeleteFile(currentCharacter.icon);
      imageApi.delete('/', { data: { name: currentCharacter.icon } })
        .then().catch(err => console.log(err.response.data));

      await charactersRepository.delete(id);
      return res.sendStatus(200);

    } catch(err) {
      throw new AppError(err.message);
    }
  }

  async linkAccount(req: Request, res: Response){
    const { user_id } = req.body;
    const { rpg_id, id: character_id } = req.params;

    const schema = yup.object().shape({
      user_id: yup.string().length(36, 'Insira um id válido').required('Insira um id válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    const rpgsParticipantRepository = getCustomRepository(RpgParticipantsRepository);

    const verifyIfCharacterIsLinked = await rpgsParticipantRepository.findOne({character_id});
    if(verifyIfCharacterIsLinked){
      throw new AppError('This character is already linked!');
    }

    const currentRpgPartData = await rpgsParticipantRepository.findOne({where:[{user_id, rpg_id}]});

    if(currentRpgPartData.character_id){
      throw new AppError('This user is already linked!');
    }

    const newRpgPartData = {
      ...currentRpgPartData,
      character_id
    }

    try{
      await rpgsParticipantRepository.update(currentRpgPartData.id, newRpgPartData);
    } catch(err) {
      console.log(err)
      throw new AppError('Error while inserting');
    }

    return res.status(200).json({ message: 'Successfully updated!'});
  }

  async unlinkAccount(req: Request, res: Response){
    const { user_id } = req.body;
    const { rpg_id, id: character_id } = req.params;

    const schema = yup.object().shape({
      user_id: yup.string().length(36, 'Insira um id válido').required('Insira um id válido')
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    const rpgsParticipantRepository = getCustomRepository(RpgParticipantsRepository);

    const currentRpgPartData = await rpgsParticipantRepository.findOne({where:[{user_id, rpg_id, character_id}]});

    const newRpgPartData = {
      ...currentRpgPartData,
      character_id: null
    }

    try{
      await rpgsParticipantRepository.update(currentRpgPartData.id, newRpgPartData);
    } catch {
      throw new AppError('Error while inserting');
    }

    return res.status(200).json({ message: 'Successfully updated!'});
  }
  
}

export default new CharacterController();