import { useStateValue } from 'src/state/state';
import Modal from './Modal';
import RemoveList from './RemoveList';
import ShareList from './ShareList';
import EditRights from './EditRights';
import AddItem from './AddItem';
import AddNote from './AddNote';
import CreateList from './CreateList';
import RenameList from './RenameList';
import { ReactNode } from 'react';
import ManageAccount from './ManageAccount';
import EditItemName from './EditItemName';
import EditNote from './EditNote';

/** Handles logic for displaying current modal */

export default function CurrentModal() {
  const [{ listState }] = useStateValue();

  if (listState[0] !== 'modal') return null;
  const modalType = listState[1].type;

  let modalTitle: string;
  let component: ReactNode;

  switch (modalType) {
    case 'addItem':
      modalTitle = 'Add Item';
      component = <AddItem />;
      break;

    case 'addNote':
      modalTitle = 'Add Note';
      component = <AddNote />;
      break;

    case 'createList':
      modalTitle = 'Create New List';
      component = <CreateList />;
      break;

    case 'renameList':
      modalTitle = 'Rename list';
      component = <RenameList />;
      break;

    case 'removeList':
      modalTitle = 'Remove List';
      component = <RemoveList />;
      break;

    case 'shareList':
      modalTitle = 'Share List';
      component = <ShareList />;
      break;

    case 'updatePrivileges':
      modalTitle = 'Edit Rights';
      component = <EditRights />;
      break;

    case 'manageAccount':
      modalTitle = 'Manage Account';
      component = <ManageAccount />;
      break;

    case 'editItemName':
      modalTitle = 'Edit Item Name';
      component = <EditItemName />;
      break;

    case 'editNote':
      modalTitle = 'Edit Note';
      component = <EditNote />;
      break;

    default:
      console.error('Modal type could not be determined in `CurrentModel`');
      return null;
  }

  return <Modal modalTitle={modalTitle} component={component} />;
}
