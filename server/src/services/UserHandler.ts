import { MyContext } from '../MyContext';
import { FieldError } from '../resolvers/types/response/FieldError';
import { UserId } from '../types';
import { trimWhiteSpaceFromString } from '../utils/common';
import {
  minCharacterLimit,
  maxCharacterLimit
} from '../../../web/src/constants';
import fieldError from './fieldError';

export interface UserHandlerParams {
  context: MyContext;
}

export abstract class UserBase {
  protected userId: UserId;
  protected errors: FieldError[] = [];

  constructor({ context }: UserHandlerParams) {
    this.validateContext(context);
    this.userId = context.req.session.userId;
  }

  private validateContext(context: MyContext) {
    if (!context.req.session.userId) {
      throw fieldError.noUserInContext;
    }
  }

  protected parseStringInput(string: string): string {
    const trimmedString = trimWhiteSpaceFromString(string);
    this.validateString(trimmedString);
    return trimmedString;
  }

  private validateString(string: string): void {
    if (string.length < minCharacterLimit) {
      throw fieldError.nameIsTooShort;
    } else if (string.length > maxCharacterLimit) {
      throw fieldError.nameIsTooLong;
    }
  }
}
