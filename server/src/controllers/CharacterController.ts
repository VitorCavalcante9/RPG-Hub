import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../models/AppError';
import { CharactersRepository } from '../repositories/CharactersRepository';
import { PermissionChangeRepository } from '../repositories/PermissionChangesRepository';
import { RpgParticipantsRepository } from '../repositories/RpgParticipantsRepository';
import CharacterView from '../views/characters_views';
import { sheetValidation } from './sheet/SheetValidation';

interface Icon {
  name: string;
  key: string;
  url: string;
}

class CharacterController {
  async store(req: Request, res: Response) {
    const { name, sheet } = req.body;
    const { rpg_id } = req.params;
    let icon: any = null;
    const charactersRepository = getCustomRepository(CharactersRepository);

    if (req.file) {
      const requestIcon = req.file as Express.Multer.File;
      icon = {
        name: requestIcon.originalname,
        key: requestIcon.key,
        url: requestIcon.location
          ? requestIcon.location
          : `${process.env.APP_URL}/${requestIcon.key}`,
      };
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      const errors = err.inner.map((inner) => {
        return `${inner.errors[0]} em ${inner.path}`;
      });
      throw new AppError(errors);
    }

    try {
      await sheetValidation(sheet);
    } catch (err) {
      throw new AppError(err.errors[0]);
    }

    const character = charactersRepository.create({
      name,
      rpg_id,
      sheet,
    });

    try {
      await charactersRepository.save(character);

      if (icon?.key) {
        await charactersRepository.insertImage(character.id, icon);
      }

      const permissionRepository = getCustomRepository(
        PermissionChangeRepository
      );

      const permission = permissionRepository.create({
        rpg_id,
        character_id: character.id,
        permission: true,
      });
      await permissionRepository.save(permission);

      return res
        .status(201)
        .json({ id: character.id, message: 'Character created successfully!' });
    } catch (err) {
      console.log(err);
      throw new AppError(err.message);
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try {
      const character = await charactersRepository.findOneOrFail(id, {
        relations: ['participant', 'participant.user', 'icon'],
      });
      return res.json(CharacterView.render(character));
    } catch {
      throw new AppError('Character does not exists');
    }
  }

  async index(req: Request, res: Response) {
    const { rpg_id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try {
      const character = await charactersRepository.find({
        where: [{ rpg_id }],
        relations: ['participant', 'participant.user', 'icon'],
      });
      return res.json(CharacterView.renderMany(character));
    } catch {
      throw new AppError('Error');
    }
  }

  async update(req: Request, res: Response) {
    const { name, previousIcon, sheet } = req.body;
    const { id } = req.params;
    let icon: Icon;
    const charactersRepository = getCustomRepository(CharactersRepository);

    if (req.file) {
      const requestIcon = req.file as Express.Multer.File;
      icon = {
        name: requestIcon.originalname,
        key: requestIcon.key,
        url: requestIcon.location
          ? requestIcon.location
          : `${process.env.APP_URL}/${requestIcon.key}`,
      };
    }

    const schema = yup.object().shape({
      name: yup.string().min(3).max(75).required('Insira um nome válido'),
      previousIcon: yup.string(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      const errors = err.inner.map((inner) => {
        return `${inner.errors[0]} em ${inner.path}`;
      });
      throw new AppError(errors);
    }

    try {
      await sheetValidation(JSON.parse(sheet));
    } catch (err) {
      throw new AppError(err.errors[0]);
    }

    const currentCharacterData = await charactersRepository.findOne(id);

    if (icon?.key) {
      await charactersRepository.deleteImage(id);
      await charactersRepository.insertImage(id, icon);
    } else if (!icon?.key && !previousIcon) {
      await charactersRepository.deleteImage(id);
    }

    const newCharacterData = {
      ...currentCharacterData,
      name,
      sheet: JSON.parse(sheet),
    };

    try {
      await charactersRepository.update(id, newCharacterData);
    } catch {
      throw new AppError('Character does not exists');
    }

    return res.json({ message: 'Successfully updated!' });
  }

  async updateUser(req: Request, res: Response) {
    const { sheet } = req.body;
    const { id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try {
      await sheetValidation(sheet);
    } catch (err) {
      throw new AppError(err.errors[0]);
    }

    const currentCharacterData = await charactersRepository.findOne(id, {
      relations: ['permission'],
    });
    const permission = currentCharacterData.permission;
    delete currentCharacterData.permission;

    const newCharacterData = {
      ...currentCharacterData,
      sheet,
    };

    try {
      await charactersRepository.update(id, newCharacterData);

      const permissionRepository = getCustomRepository(
        PermissionChangeRepository
      );

      await permissionRepository.delete(permission.id);
    } catch (err) {
      console.error(err);
      throw new AppError('Character does not exists');
    }

    return res.json({ message: 'Successfully updated!' });
  }

  async delete(req: Request, res: Response) {
    const { rpg_id, id } = req.params;
    const charactersRepository = getCustomRepository(CharactersRepository);

    try {
      const rpgsParticipantRepository = getCustomRepository(
        RpgParticipantsRepository
      );
      const currentRpgPartData = await rpgsParticipantRepository.findOne({
        where: [{ character_id: id, rpg_id }],
      });

      if (currentRpgPartData) {
        const newRpgPartData = {
          ...currentRpgPartData,
          character_id: null,
        };
        await rpgsParticipantRepository.update(
          currentRpgPartData.id,
          newRpgPartData
        );
      }

      await charactersRepository.deleteImage(id);

      await charactersRepository.delete(id);
      return res.sendStatus(200);
    } catch (err) {
      throw new AppError(err.message);
    }
  }

  async linkAccount(req: Request, res: Response) {
    const { user_id } = req.body;
    const { rpg_id, id: character_id } = req.params;

    const schema = yup.object().shape({
      user_id: yup
        .string()
        .length(36, 'Insira um id válido')
        .required('Insira um id válido'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err.message);
    }

    const rpgsParticipantRepository = getCustomRepository(
      RpgParticipantsRepository
    );

    const verifyIfCharacterIsLinked = await rpgsParticipantRepository.findOne({
      character_id,
    });
    if (verifyIfCharacterIsLinked) {
      throw new AppError('This character is already linked!');
    }

    const currentRpgPartData = await rpgsParticipantRepository.findOne({
      where: [{ user_id, rpg_id }],
    });

    if (currentRpgPartData.character_id) {
      throw new AppError('This user is already linked!');
    }

    const newRpgPartData = {
      ...currentRpgPartData,
      character_id,
    };

    try {
      await rpgsParticipantRepository.update(
        currentRpgPartData.id,
        newRpgPartData
      );
    } catch (err) {
      console.log(err);
      throw new AppError('Error while inserting');
    }

    return res.status(200).json({ message: 'Successfully updated!' });
  }

  async unlinkAccount(req: Request, res: Response) {
    const { user_id } = req.body;
    const { rpg_id, id: character_id } = req.params;

    const schema = yup.object().shape({
      user_id: yup
        .string()
        .length(36, 'Insira um id válido')
        .required('Insira um id válido'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err.message);
    }

    const rpgsParticipantRepository = getCustomRepository(
      RpgParticipantsRepository
    );

    const currentRpgPartData = await rpgsParticipantRepository.findOne({
      where: [{ user_id, rpg_id, character_id }],
    });

    const newRpgPartData = {
      ...currentRpgPartData,
      character_id: null,
    };

    try {
      await rpgsParticipantRepository.update(
        currentRpgPartData.id,
        newRpgPartData
      );
    } catch {
      throw new AppError('Error while inserting');
    }

    return res.status(200).json({ message: 'Successfully updated!' });
  }
}

export default new CharacterController();
