import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { CharactersRepository } from '../repositories/CharactersRepository';
import { RpgsRepository } from '../repositories/RpgsRepository';
import { validation } from './sheet/SheetValidation';

interface Status {
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface Skills {
  name: string;
  current: number;
  limit: number;
}

class SheetController {
  async update(req: Request, res: Response) {
    const { status, skills, limitOfPoints } = req.body;
    const { blocks } = req.body;
    const { rpg_id: id } = req.params;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    try {
      await validation(blocks);
    } catch (err) {
      console.log(err);
      throw new AppError(err.errors[0]);
    }

    const currentRpgData = await rpgsRepository.findOne(id);

    const newRpgData = {
      ...currentRpgData,
      sheet: blocks,
    };

    try {
      await rpgsRepository.update(id, newRpgData);

      return res.json({ message: 'Successfully updated!' });

      const charactersRepository = getCustomRepository(CharactersRepository);
      const characters = await charactersRepository.find({
        where: [{ rpg_id: id }],
      });

      if (characters.length > 0) {
        characters.forEach(async (character, position) => {
          const skillsUnchanged = character.skills.filter((skill: Skills) => {
            const index = skills
              .map((this_skill) => this_skill.name)
              .indexOf(skill.name);
            return index !== -1;
          });

          const newSkills = skills.filter((skill: Skills) => {
            const index = character.skills
              .map((this_skill) => this_skill.name)
              .indexOf(skill.name);
            return index === -1;
          });

          let clumpedStatus = [];

          character.status.forEach((one_status: Status) => {
            const index = status
              .map((this_status) => this_status.name)
              .indexOf(one_status.name);
            if (index !== -1) clumpedStatus.push(one_status);
          });

          status.forEach((one_status: Status, index) => {
            const ind = clumpedStatus
              .map((this_status) => this_status.name)
              .indexOf(one_status.name);

            if (ind === -1) clumpedStatus.splice(index, 0, one_status);
            else {
              const [reorderedItem] = clumpedStatus.splice(ind, 1);
              clumpedStatus.splice(index, 0, reorderedItem);
            }
          });

          const newCharacterData = {
            ...character,
            status: clumpedStatus,
            skills: [...skillsUnchanged, ...newSkills],
          };

          await charactersRepository.update(character.id, newCharacterData);
        });
      }
    } catch {
      throw new AppError('RPG does not exists');
    }

    return res.json({ message: 'Successfully updated!' });
  }

  async show(req: Request, res: Response) {
    const { rpg_id: id } = req.params;

    const rpgsRepository = getCustomRepository(RpgsRepository);

    try {
      const rpg = await rpgsRepository.findOneOrFail(id);
      return res.json(rpg.sheet);
    } catch {
      throw new AppError('RPG does not exists');
    }
  }
}

export default new SheetController();
