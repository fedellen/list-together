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

/** Handles logic for displaying current modal */

export default function CurrentModal() {
  const [{ modalState }] = useStateValue();
  if (!modalState.active) return null;

  const currentListName = useCurrentListName();

  /** Uses `addItem` for default values */
  let modalTitle = <h2>Add Item</h2>;
  let component = <AddItem />;

  if (modalState.type === 'addNote') {
    modalTitle = <h2>Add Note</h2>;
    component = <AddNote />;
  } else if (modalState.type === 'createList') {
    modalTitle = <h2>Create New List</h2>;
    component = <CreateList />;
  } else if (modalState.type === 'renameList') {
    modalTitle = currentListName ? (
      <h2>
        Rename list:
        <br /> {currentListName}?
      </h2>
    ) : (
      <h2>Rename current list?</h2>
    );
    component = <RenameList />;
  } else if (modalState.type === 'removeList') {
    modalTitle = (
      <h2>
        Confirm
        <br /> Remove List
      </h2>
    );
    component = <RemoveList />;
  } else if (modalState.type === 'shareList') {
    modalTitle = <h2>Share List</h2>;
    component = <ShareList />;
  } else if (modalState.type === 'updatePrivileges') {
    modalTitle = <h2>Edit Rights</h2>;
    component = <EditRights />;
  }

  // else 'addItem' default

  return <Modal modalTitle={modalTitle} component={component} />;
}
