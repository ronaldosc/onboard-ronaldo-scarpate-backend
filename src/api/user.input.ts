import { UserModel } from '@domain';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput implements UserModel {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  birthdate!: string;

  @Field()
  password!: string;
}
