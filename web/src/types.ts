export type UserPrivileges = 'add' | 'strike' | 'delete' | 'owner';

/** State for handling which Item modal is open */
export type ToggleItemState = {
  active: boolean;
  itemName: string;
  type: 'options' | 'addNote' | 'deleteItem';
};

/** Side menu states determine what happens when clicking on items */
export type SideMenuState = 'shop' | 'add' | 'sort';

/** Actions to take from user clicking on `ItemOptions` modal buttons */
export type OptionAction =
  | 'addNote'
  | 'strikeItem'
  | 'boldItem'
  | 'deleteItem'
  | 'sortItemUp'
  | 'sortItemDown';

type ModalTypes =
  | 'menu'
  | 'addItem'
  | 'createList'
  | 'itemOptions'
  | 'addNote'
  | 'shareList'
  | 'removeList';

/** Currently displayed modal */
export type ModalState = {
  active: boolean;
  itemName?: string;
  type?: ModalTypes;
};
