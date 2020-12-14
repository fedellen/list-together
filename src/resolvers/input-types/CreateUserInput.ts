import { IsEmail, Length, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { EmailExist } from './validators/EmailExist';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @IsEmail()
  @EmailExist({ message: 'email is already in use' })
  email: string;

  @MinLength(5)
  @Field()
  password: string;
}
