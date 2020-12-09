import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import {
  IsEmailAlreadyExist
  // IsUserAlreadyExist
} from './IsEmailOrUsernameExist';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'email is already in use' })
  email: string;

  @Field()
  password: string;
}
