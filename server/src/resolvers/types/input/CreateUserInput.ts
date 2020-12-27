import { Field, InputType } from 'type-graphql';
@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
