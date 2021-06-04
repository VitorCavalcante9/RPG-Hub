import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { CharactersRepository } from '../repositories/CharactersRepository';
import { NotesRepository } from '../repositories/NotesRepository';
import { ObjectsRepository } from '../repositories/ObjectsRepository';
import { ScenariosRepository } from '../repositories/ScenariosRepository';
import NotesView from '../views/notes_views';
import SessionView from '../views/session_view';

interface Character{
  id: string;
  status: Array<{
    name: string;
    color: string;
    current: number;
    limit: number;
  }>;
  inventory: Array<string>
}

class GameController{
  async initSession(req: Request, res: Response){
    const { rpg_id } = req.params;

    const charactersRepository = getCustomRepository(CharactersRepository);
    const scenariosRepository = getCustomRepository(ScenariosRepository);
    const objectsRepository = getCustomRepository(ObjectsRepository);

    try{
      const characters = await charactersRepository.find({rpg_id});
      const scenarios = await scenariosRepository.find({rpg_id});
      const objects = await objectsRepository.find({rpg_id});

      return res.json(SessionView.render(characters, scenarios, objects));

    } catch {
      throw new AppError('Error');
    }
  }

  async saveSession(req: Request, res: Response){
    const { characters } = req.body;
    const charactersList: Character[] = characters;
    const charactersRepository = getCustomRepository(CharactersRepository);

    const schema = yup.object().shape({
      characters: yup.array(yup.object({
        id: yup.string().length(36).required('Insira um id válido'),
        inventory: yup.array(yup.string()),
        status: yup.array(yup.object({
          name: yup.string().required(),
          color: yup.string().min(3).max(7).required(),
          current: yup.number().min(0).integer().required('Insira um valor válido'),
          limit: yup.number().min(0).integer().required('Insira um valor válido')
        }))
      }))
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }
    
    try{
      //Save Characters
      charactersList.map(async character => {
        const currentCharacterData = await charactersRepository.findOne(character.id);
        const newCharacterData = {
          ...currentCharacterData,
          status: character.status,
          inventory: character.inventory
        };

        await charactersRepository.update(character.id, newCharacterData);
      })
    } catch(err) {
      throw new AppError(err.message);
    }

    return res.json({message: 'Saved successfully'});
  }

  async showNotes(req: Request, res: Response){
    const { rpg_id } = req.params;
    const notesRepository = getCustomRepository(NotesRepository);
    const user_id = req.userId;

    try{
      const notes = await notesRepository.findOneOrFail({ user_id, rpg_id });
      return res.json(NotesView.render(notes));

    } catch(err) {
      throw new AppError(err.message);
    }
  }

  async saveNotes(req: Request, res: Response){
    const { notes } = req.body;
    const { rpg_id } = req.params;
    const notesRepository = getCustomRepository(NotesRepository);

    const schema = yup.object().shape({
      notes: yup.array(yup.string())
    })

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.errors);
    }

    try{
      const currentNotesData = await notesRepository.findOneOrFail({ user_id: req.userId, rpg_id});
      const newNotesData = {
        ...currentNotesData,
        notes
      }

      await notesRepository.update(currentNotesData.id, newNotesData);

    } catch(err) {
      throw new AppError(err.message);
    }

    return res.sendStatus(200);
  }
}

export default new GameController();