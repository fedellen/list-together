/** User privileges unique to each list */
export type UserPrivileges = 'add' | 'strike' | 'delete' | 'owner';

/** State for handling which Item modal is open */
export type ToggleItemState = {
  active: boolean;
  itemName: string;
  type: 'options' | 'addNote' | 'deleteItem';
};

/** Side menu states determine what happens when clicking on items */
export type SideMenuState = 'shop' | 'add' | 'sort';
