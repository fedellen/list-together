import { IsUUID, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ChangePasswordInput {
  @IsUUID(4)
  @Field()
  token: string;

  @MinLength(5)
  @Field()
  password: string;
}
