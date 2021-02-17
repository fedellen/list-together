import { UserPrivileges } from '../../../entities';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePrivilegesInput {
  @Field()
  listId: string;

  @Field()
  email: string;

  /** When privileges is undefined/null, list rights are revoked */
  @Field(() => String, { nullable: true })
  privileges?: UserPrivileges;
}
