import { CreateUserResponseModel } from '@domain';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class UserType implements CreateUserResponseModel{
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  birthdate!: string;
}
