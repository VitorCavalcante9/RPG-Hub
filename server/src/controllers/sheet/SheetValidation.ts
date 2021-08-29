import * as yup from 'yup';
import { SubListItem } from './SheetInterfaces';

const objects = {
  status: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(6).required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.object({
          name: yup.string().required('Insira um nome válido para o status'),
          color: yup.string().min(3).max(7).required('Insira uma cor válida'),
          current: yup
            .number()
            .min(0, 'Insira um número maior que 0')
            .integer()
            .required('Insira um valor atual válido para o status'),
          limit: yup
            .number()
            .min(0, 'Insira um número maior que 0')
            .integer()
            .required('Insira um valor limite válido para o status'),
        })
      )
      .required(),
  }),
  skills: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(6).required('Insira um tipo válido para o bloco'),
    value: yup.array(
      yup
        .object({
          name: yup.string().required('Insira um nome válido'),
          value: yup
            .number()
            .min(0, 'Insira um número maior que 0')
            .integer()
            .required('Insira um valor válido'),
        })
        .required()
    ),
    limitOfPoints: yup
      .number()
      .integer()
      .min(0, 'Insira um número maior que 0 em limite de pontos')
      .required('Insira um limite de pontos válido'),
  }),
  list: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(4).required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.string().min(2, 'Insira algo que tenha no mínimo 2 caracteres')
      )
      .required(),
  }),
  textarea: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(8).required('Insira um tipo válido para o bloco'),
    value: yup.string(),
  }),
  multiSelectList: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup
      .string()
      .length(15)
      .required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.object({
          name: yup.string().required('Insira um nome válido'),
          isSelected: yup.bool().required(),
        })
      )
      .required(),
  }),
  nameList: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(8).required('Insira um tipo válido para o bloco'),
    value: yup.array(
      yup.object({
        name: yup.string().required('Insira um nome válido'),
        value: yup.string(),
      })
    ),
  }),
  numList: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(7).required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.object({
          name: yup.string().required('Insira um nome válido'),
          value: yup.number().integer().required('Insira um valor válido'),
        })
      )
      .required(),
  }),
  inventory: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(9).required('Insira um tipo válido para o bloco'),
    value: yup.array(
      yup.object({
        name: yup.string().required('Insira um nome válido'),
        image: yup.string(),
        description: yup.string(),
      })
    ),
  }),
  table: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(5).required('Insira um tipo válido para o bloco'),
    columns: yup.array(
      yup.object({
        name: yup
          .string()
          .min(2, 'Insira um nome para a coluna com no mínimo 2 caracteres')
          .required('Insira um nome para a coluna'),
        type: yup.string().required('Insira um tipo de valor para a coluna'),
      })
    ),
    value: yup.array(yup.object({})).required(),
  }),
  subList: yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .min(3, 'Insira um nome com mais de 3 caracteres para o bloco')
      .required('Insira um nome válido para o bloco'),
    type: yup.string().length(7).required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.object({
          id: yup.string().required(),
          title: yup
            .string()
            .required('Insira um nome válido para a sub-lista'),
        })
      )
      .required(),
  }),
};

const subListObjects = {
  list: yup.object({
    name: yup
      .string()
      .required('Insira um nome válido para o item da sub-lista'),
    type: yup.string().length(4).required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.string().min(2, 'Insira algo que tenha no mínimo 2 caracteres')
      )
      .required(),
  }),
  textarea: yup.object({
    name: yup
      .string()
      .required('Insira um nome válido para o item da sub-lista'),
    type: yup.string().length(8).required('Insira um tipo válido para o bloco'),
    value: yup.string(),
  }),
  multiSelectList: yup.object({
    name: yup
      .string()
      .required('Insira um nome válido para o item da sub-lista'),
    type: yup
      .string()
      .length(15)
      .required('Insira um tipo válido para o bloco'),
    value: yup
      .array(
        yup.object({
          name: yup.string().required('Insira um nome válido'),
          isSelected: yup.bool().required(),
        })
      )
      .required(),
  }),
  nameItem: yup.object({
    name: yup
      .string()
      .required('Insira um nome válido para o item da sub-lista'),
    type: yup.string().length(8).required('Insira um tipo válido para o bloco'),
    value: yup.string(),
  }),
  numItem: yup.object({
    name: yup
      .string()
      .required('Insira um nome válido para o item da sub-lista'),
    type: yup.string().length(7).required('Insira um tipo válido para o bloco'),
    value: yup.number().integer().required('Insira um valor válido'),
  }),
};

export async function sheetValidation(
  blocks: Array<{ name: string; type: string; value: any }>
) {
  let unvalidatedBlocks = [...blocks];

  return new Promise((resolve, reject) => {
    blocks.forEach(async (block) => {
      if (block.type === 'subList') {
        block.value.forEach((subList: SubListItem) => {
          subList.value.forEach(async (item) => {
            try {
              await subListObjects[item.type].validate(item, {
                aboutEarly: false,
              });
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      await objects[block.type]
        .validate(block, { aboutEarly: false })
        .then(() => {
          unvalidatedBlocks.shift();
        })
        .catch((err) => reject(err));

      if (unvalidatedBlocks.length === 0) resolve(null);
    });
  });
}
