export type ArrowIconDirection = 'right' | 'left';

/** Postgres only saves UserPrivilegesType */
export type UserPrivileges = 'read' | 'add' | 'strike' | 'delete' | 'owner';

/** State for handling which Item modal is open */
export type ToggleItemState = {
  active: boolean;
  itemName: string;
  type: 'options' | 'addNote' | 'deleteItem';
};

export type Theme = 'light' | 'dark';

export type UndoState =
  | ['addItem', { itemName: string; listId: string }]
  | ['addNote', { note: string; itemName: string; listId: string }]
  | ['deleteItems', { itemNameArray: string[]; listId: string }]
  | ['deleteNote', { note: string; itemName: string; listId: string }]
  | ['strikeItem', { itemName: string; listId: string }]
  | ['sortItems', { listId: string; previousItemArray: string[] }]
  | ['sortLists', { previousListArray: string[] }];

export type ListState =
  | ['item', ItemState]
  | ['note', NoteState]
  | ['modal', ModalState]
  | ['options']
  | ['side'];

export type ItemState = { id: string; name: string };
export type NoteState = { item: string; note: string };

/** Actions to take from user clicking on `ItemOptions` modal buttons */
export type OptionAction =
  | 'addNote'
  | 'strikeItem'
  | 'boldItem'
  | 'deleteItem'
  | 'sortItemUp'
  | 'sortItemDown';

export type ModalTypes =
  | 'addItem'
  | 'createList'
  | 'renameList'
  | 'addNote'
  | 'shareList'
  | 'removeList'
  | 'updatePrivileges';

/** State for which page to show */
export type AppState = 'home' | 'login' | 'createUser' | 'demo' | 'list';

/** Currently displayed modal */
export type ModalState = {
  active: boolean;
  itemName?: string;
  type?: ModalTypes;
};
