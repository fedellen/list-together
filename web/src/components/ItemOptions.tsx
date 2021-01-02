import { UserPrivileges } from 'src/types';
import Button from './Button';
import { OptionAction } from './ItemList';

type ItemOptionsProps = {
  /** Name of the item clicked on */
  // itemName: string;
  /** Array of user privileges for the list */
  userPrivileges: UserPrivileges[];
  /** Function to handle clicking on an item option */
  handleOptionAction: (optionAction: OptionAction) => void;
};

export default function ItemOptions({
  // itemName,
  handleOptionAction,
  userPrivileges
}: ItemOptionsProps) {
  return (
    <>
      {/** Display buttons user has access to */}
      {(userPrivileges.includes('add') || userPrivileges.includes('owner')) && (
        <Button text="Add Note" onClick={() => handleOptionAction('addNote')} />
      )}
      <Button text="Bold Item" onClick={() => handleOptionAction('boldItem')} />
      {(userPrivileges.includes('strike') ||
        userPrivileges.includes('owner')) && (
        <Button
          text="Strike Item"
          onClick={() => handleOptionAction('strikeItem')}
        />
      )}
      {(userPrivileges.includes('delete') ||
        userPrivileges.includes('owner')) && (
        <Button
          text="Delete Item"
          onClick={() => handleOptionAction('deleteItem')}
        />
      )}
      <Button text="Move Up" onClick={() => handleOptionAction('sortItemUp')} />
      <Button
        text="Move Down"
        onClick={() => handleOptionAction('sortItemDown')}
      />
    </>
  );
}
