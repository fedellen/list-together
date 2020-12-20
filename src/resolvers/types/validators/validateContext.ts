import { MyContext } from '../../../MyContext';

export const validateContext = (context: MyContext) => {
  if (!context.req.session.userId) {
    return [
      {
        field: 'context',
        message: 'Context contains no userId..'
      }
    ];
  }

  return null;
};
