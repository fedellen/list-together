/** Validation to confirm users can only insert `UserPrivileges` type through graphQL api */
export const validatePrivilegeType = (privilege: string) => {
  if (
    privilege !== 'read' &&
    privilege !== 'add' &&
    privilege !== 'strike' &&
    privilege !== 'delete' &&
    privilege !== 'owner'
  ) {
    return [
      {
        field: 'privilege',
        message:
          'That is not a valid privilege type.. Try `read`, `add`, `strike`, or `delete`.'
      }
    ];
  }

  return null;
};
