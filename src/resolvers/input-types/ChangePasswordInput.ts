import { Field, InputType } from 'type-graphql';
// import { PasswordInput } from "../../shared/PasswordInput";

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}
