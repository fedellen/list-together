import { useStateValue } from 'src/state/state';
import Modal from './Modal';
import RemoveList from './RemoveList';
import ShareList from './ShareList';
import EditRights from './EditRights';
import AddItem from './AddItem';
import AddNote from './AddNote';
import CreateList from './CreateList';
import RenameList from './RenameList';
import useCurrentListName from 'src/hooks/fragments/useCurrentListName';
import { ReactNode } from 'react';

/** Handles logic for displaying current modal */

export default function CurrentModal() {
  const [{ listState }] = useStateValue();
  const currentListName = useCurrentListName();

  if (listState[0] !== 'modal') return null;
  const modalType = listState[1].type;

  /** Uses `addItem` for default values */
  let modalTitle: ReactNode;
  let component: ReactNode;

  switch (modalType) {
    case 'addItem':
      modalTitle = <h2>Add Item</h2>;
      component = <AddItem />;
      break;

    case 'addNote':
      modalTitle = <h2>Add Note</h2>;
      component = <AddNote />;
      break;

    case 'createList':
      modalTitle = <h2>Create New List</h2>;
      component = <CreateList />;
      break;

    case 'renameList':
      modalTitle = currentListName ? (
        <h2>
          Rename list:
          <br /> {currentListName}?
        </h2>
      ) : (
        <h2>Rename current list?</h2>
      );
      component = <RenameList />;
      break;

    case 'removeList':
      modalTitle = (
        <h2>
          Confirm
          <br /> Remove List
        </h2>
      );
      component = <RemoveList />;
      break;

    case 'shareList':
      modalTitle = <h2>Share List</h2>;
      component = <ShareList />;
      break;

    case 'updatePrivileges':
      modalTitle = <h2>Edit Rights</h2>;
      component = <EditRights />;
      break;

    default:
      console.error('Modal type could not be determined in `CurrentModel`');
      return null;
  }

  return <Modal modalTitle={modalTitle} component={component} />;
}
