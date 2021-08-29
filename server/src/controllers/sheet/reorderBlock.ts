import {
  GenericBlock,
  SubListInterface,
  SubListItem,
  TableInterface,
} from './SheetInterfaces';

export function reorderBlock(blockChar: GenericBlock, block: GenericBlock) {
  switch (blockChar.type) {
    case 'list':
      return blockChar;
    case 'textarea':
      return blockChar;
    case 'numListLimit':
      return blockChar;
    case 'table':
      const reorderedTableBlock = reorderTableBlock(
        blockChar as TableInterface,
        block as TableInterface
      );
      return reorderedTableBlock;
    case 'subList':
      const reorderedSubListBlock = reorderSubListBlock(
        blockChar as SubListInterface,
        block as SubListInterface
      );
      return reorderedSubListBlock;
    default:
      const reorderedBlock = reorderDefaultBlock(blockChar, block);
      return reorderedBlock;
  }
}

function reorderDefaultBlock(blockChar: GenericBlock, block: GenericBlock) {
  let updatedBlock = blockChar;

  updatedBlock.value = blockChar.value.filter((itemChar) => {
    const verifyIfItemExists = block.value.find(
      (item) => item.name === itemChar.name
    );
    return verifyIfItemExists;
  });

  block.value.forEach((item, index) => {
    const verifyIfItemExists = updatedBlock.value.find(
      (itemChar) => itemChar.name === item.name
    );

    if (!verifyIfItemExists) {
      updatedBlock.value.splice(index, 0, item);
    } else {
      const prevIndex = updatedBlock.value.findIndex(
        (itemChar) => itemChar.name === item.name
      );

      const [reorderedItem] = updatedBlock.value.splice(prevIndex, 1);
      updatedBlock.value.splice(index, 0, reorderedItem);
    }
  });

  return updatedBlock;
}

function reorderTableBlock(blockChar: TableInterface, block: TableInterface) {
  let updatedBlock = blockChar;

  updatedBlock.columns = blockChar.columns.filter((columnChar) => {
    const verifyIfColumnExists = block.columns.find(
      (column) =>
        column.name === columnChar.name && column.type === columnChar.type
    );
    return verifyIfColumnExists;
  });

  updatedBlock.value = blockChar.value.map((row) => {
    const filteredRow = {};
    for (const key in row) {
      const verifyIfColumnExists = block.columns.find(
        (column) => column.name === key
      );
      if (verifyIfColumnExists) filteredRow[key] = row[key];
    }

    return filteredRow;
  });

  block.columns.forEach((column, index) => {
    const verifyIfColumnExists = updatedBlock.columns.find(
      (columnChar) =>
        columnChar.name === column.name && columnChar.type === column.type
    );
    if (!verifyIfColumnExists) {
      updatedBlock.columns.splice(index, 0, column);

      updatedBlock.value = updatedBlock.value.map((rowChar) => {
        const newRow = { ...rowChar };
        newRow[column.name] = column.type === 'string' ? '' : 0;
        return newRow;
      });
    } else {
      const prevIndex = updatedBlock.columns.findIndex(
        (columnChar) => columnChar.name === column.name
      );
      const [reorderedColumn] = updatedBlock.columns.splice(prevIndex, 1);
      updatedBlock.columns.splice(index, 0, reorderedColumn);
    }
  });

  return updatedBlock;
}

function reorderSubListBlock(
  blockChar: SubListInterface,
  block: SubListInterface
) {
  let updatedBlock = blockChar;

  updatedBlock.value = blockChar.value.filter((itemChar) => {
    const verifyIfItemExists = block.value.find(
      (item) => item.id === itemChar.id
    );
    return verifyIfItemExists;
  });

  block.value.forEach((item, index) => {
    const verifyIfItemExists = updatedBlock.value.find(
      (itemChar) => itemChar.id === item.id
    );

    if (!verifyIfItemExists) {
      updatedBlock.value.splice(index, 0, item);
    } else {
      const prevIndex = updatedBlock.value.findIndex(
        (itemChar) => itemChar.id === item.id
      );

      const [reorderedItem] = updatedBlock.value.splice(prevIndex, 1);
      const reorderedSubListItem = reorderSubListItems(reorderedItem, item);
      updatedBlock.value.splice(index, 0, reorderedSubListItem);
    }
  });

  return updatedBlock;
}

function reorderSubListItems(
  subListItemChar: SubListItem,
  subListItem: SubListItem
) {
  let updatedField = subListItemChar;

  updatedField.value = subListItemChar.value.filter((itemChar) => {
    const verifyIfItemExists = subListItem.value.find(
      (item) => item.name === itemChar.name && item.type === itemChar.type
    );
    return verifyIfItemExists;
  });

  subListItem.value.forEach((item, index) => {
    const verifyIfItemExists = updatedField.value.find(
      (itemChar) => itemChar.name === item.name
    );

    if (!verifyIfItemExists) {
      updatedField.value.splice(index, 0, item);
    } else {
      const prevIndex = updatedField.value.findIndex(
        (itemChar) => itemChar.name === item.name
      );

      let [reorderedItem] = updatedField.value.splice(prevIndex, 1);

      updatedField.value.splice(index, 0, reorderedItem);
    }
  });

  return updatedField;
}
