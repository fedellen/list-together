import { UserToList } from '../../../entities';
import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class UserToListResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [UserToList], { nullable: true })
  userToList?: UserToList[];

  @Field(() => [String], { nullable: true })
  notifications?: string[];
}
