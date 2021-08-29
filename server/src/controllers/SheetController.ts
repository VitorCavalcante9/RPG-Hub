import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import crypto from 'crypto';

import { AppError } from '../models/AppError';
import { CharactersRepository } from '../repositories/CharactersRepository';
import { RpgsRepository } from '../repositories/RpgsRepository';

import { reorderBlock } from './sheet/reorderBlock';
import { GenericBlock, SubListInterface } from './sheet/SheetInterfaces';
import { sheetValidation } from './sheet/SheetValidation';

class SheetController {
  async update(req: Request, res: Response) {
    const { blocks } = req.body;
    const { rpg_id: id } = req.params;
    const rpgsRepository = getCustomRepository(RpgsRepository);

    try {
      await sheetValidation(blocks);
    } catch (err) {
      console.log(err);
      throw new AppError(err.errors[0]);
    }

    const currentRpgData = await rpgsRepository.findOne(id);

    let sheet = blocks.map((block: GenericBlock) => {
      let newId = block.id;

      while (newId.length !== 4) {
        let randomBytes = crypto.randomBytes(2).toString('hex');

        const verifyIfIdExists = blocks.find(
          (block2: GenericBlock) => block2.id === randomBytes
        );
        if (!verifyIfIdExists) newId = randomBytes;
      }

      if (block.type === 'subList') {
        let subListBlock = block as SubListInterface;
        let subListValueWithId = subListBlock.value.map((item) => {
          let newSubListItemId = item.id;

          while (newSubListItemId.length !== 4) {
            let randomBytes = crypto.randomBytes(2).toString('hex');

            const verifyIfIdExists = subListBlock.value.find(
              (subListBlock2) => subListBlock2.id === randomBytes
            );
            if (!verifyIfIdExists) newSubListItemId = randomBytes;
          }

          return {
            ...item,
            id: newSubListItemId,
          };
        });

        return {
          ...subListBlock,
          value: subListValueWithId,
          id: newId,
        };
      }

      return {
        ...block,
        id: newId,
      };
    });

    const newRpgData = {
      ...currentRpgData,
      sheet,
    };

    try {
      await rpgsRepository.update(id, newRpgData);

      const charactersRepository = getCustomRepository(CharactersRepository);
      const characters = await charactersRepository.find({
        where: [{ rpg_id: id }],
      });

      if (characters.length > 0) {
        characters.forEach(async (character) => {
          let updatedSheet = character.sheet.filter(
            (blockChar: { id: string }) => {
              const verifyIfBlockExists = sheet.find(
                (block: { id: string }) => block.id === blockChar.id
              );
              return verifyIfBlockExists;
            }
          );

          sheet.forEach((block: GenericBlock, index: number) => {
            const verifyIfBlockExists = updatedSheet.find(
              (blockChar: { id: string }) => blockChar.id === block.id
            );

            if (!verifyIfBlockExists) {
              updatedSheet.splice(index, 0, block);
            } else {
              const prevIndex = updatedSheet.findIndex(
                (blockChar) => blockChar.id === block.id
              );

              const [reorderedItem] = updatedSheet.splice(prevIndex, 1);
              const reorderedBlock = reorderBlock(reorderedItem, block);

              updatedSheet.splice(index, 0, reorderedBlock);
            }
          });

          const newCharacterData = {
            ...character,
            sheet: updatedSheet,
          };

          await charactersRepository.update(character.id, newCharacterData);
        });
        return res.json({ message: 'Successfully updated!' });
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
