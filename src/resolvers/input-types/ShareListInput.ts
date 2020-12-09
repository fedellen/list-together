import { UserPrivileges } from '../../entities';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ShareListInput {
  @Field()
  listId: string;

  @Field()
  email: string;

  @Field(() => [String])
  privileges: UserPrivileges[];
}
