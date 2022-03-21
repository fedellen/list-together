import { ObjectType, Field } from 'type-graphql';

export function isFieldError(err: FieldError | unknown): err is FieldError {
  if (err === null || typeof err !== 'object') {
    return false;
  }

  const objectKeys = Object.keys(err as object);

  return objectKeys.includes('field') && objectKeys.includes('message');
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
