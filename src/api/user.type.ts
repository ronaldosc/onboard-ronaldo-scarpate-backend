import { UserModel } from '@domain';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CreateUserType implements UserModel {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  birthdate!: string;
}
