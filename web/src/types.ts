export type ArrowIconDirection = 'right' | 'left';

/** Postgres only saves UserPrivilegesType */
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

export type ModalTypes =
  | 'menu'
  | 'addItem'
  | 'createList'
  // | 'itemOptions'
  | 'addNote'
  | 'shareList'
  | 'removeList';

/** State to handle current list attributes */
export type CurrentListState = {
  listId: string;
  /** Current UserPrivileges to determine which options to show */
  privileges: UserPrivileges[];
  /** To use in `sortItems` mutation */
  sortedItems: string[];
};

/** State for which page to show */
export type AppState = 'home' | 'login' | 'createUser' | 'demo' | 'list';

/** Currently displayed modal */
export type ModalState = {
  active: boolean;
  itemName?: string;
  type?: ModalTypes;
};
