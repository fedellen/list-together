import { MyContext } from '../MyContext';
import { UserId } from '../types';
import fieldError from './fieldError';

export interface UserHandlerParams {
  context: MyContext;
}

export abstract class UserBase {
  protected userId: UserId;

  constructor({ context }: UserHandlerParams) {
    this.validateContext(context);
    this.userId = context.req.session.userId;
  }

  private validateContext(context: MyContext) {
    if (!context.req.session.userId) {
      throw fieldError.noUserInContext;
    }
  }
}
