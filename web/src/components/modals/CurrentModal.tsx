import { useStateValue } from 'src/state/state';
// import { ItemOptions } from './ItemOptions';
import { Menu } from './Menu';
import Modal from './Modal';
import RemoveList from './RemoveList';
import SingleInput from './SingleInput';

/** Handles logic for displaying current modal */

export default function CurrentModal() {
  const [{ modalState }] = useStateValue();

  if (!modalState.active) return null;

  /** Uses `addItem` for default values */
  let modalTitle = 'Add Item';
  let component = <SingleInput />;

  if (modalState.type === 'addNote') {
    modalTitle = 'Add Note';
    // <SingleInput />
  } else if (modalState.type === 'createList') {
    modalTitle = 'Create New List';
    // <SingleInput />
    // } else if (modalState.type === 'itemOptions') {
    //   modalTitle = modalState.itemName || 'options';
    //   component = <ItemOptions />;
  } else if (modalState.type === 'menu') {
    modalTitle = 'Menu';
    component = <Menu />;
  } else if (modalState.type === 'removeList') {
    modalTitle = 'Remove current list?';
    component = <RemoveList />;
  } // else 'addItem'

  return <Modal modalTitle={modalTitle} component={component} />;
}
