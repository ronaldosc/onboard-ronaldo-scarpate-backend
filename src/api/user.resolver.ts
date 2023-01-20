import { User } from '@db/entities/user';
import { CreateUserResponseModel } from '@domain/model';
import { CreateUserUserCase } from '@domain/mutation';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateUserInput } from './user.input';
import { UserType } from './user.type';

@Service()
@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly createUserUseCase: CreateUserUserCase) {}

  @Query(() => String)
  test() {
    return "I'm working.";
  }

  @Mutation(() => UserType)
  createUser(
    @Arg('data')
    input: CreateUserInput,
  ): Promise<CreateUserResponseModel> {
    return this.createUserUseCase.exec(input);
  }
}
