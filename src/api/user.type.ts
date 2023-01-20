import { UserModel } from '@domain/model';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class UserType implements UserModel {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  birthdate!: string;

  @Field()
  password!: string;
}
