import { UserPrivileges } from '../../../entities';
import { Field, InputType } from 'type-graphql';
import { IsEmail, IsUUID } from 'class-validator';

@InputType()
export class ShareListInput {
  @IsUUID(4)
  @Field()
  listId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => [String])
  privileges: UserPrivileges[];
}
