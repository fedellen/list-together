import { List } from '../../../entities';
import { FieldError } from '../response/FieldError';

export const validateAddToList = (
  list: List,
  itemName: string
): FieldError[] | null => {
  if (list.items!.length >= 150) {
    return [
      {
        field: 'listId',
        message: 'Lists cannot have more than 150 items..'
      }
    ];
  }

  const itemExists = list.items!.find(({ name }) => name === itemName);
  if (itemExists) {
    return [
      {
        field: 'name',
        message: 'Item already exists on this list..'
      }
    ];
  }

  return null;
};
