import { CreateUserResponseModel, CreateUserUseCase } from '@domain';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateUserInput } from './user.input';
import { CreateUserType } from './user.type';

@Service()
@Resolver()
export class UserResolver {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Mutation(() => CreateUserType)
  createUser(
    @Arg('input')
    input: CreateUserInput,
  ): Promise<CreateUserResponseModel> {
    return this.createUserUseCase.exec(input);
  }

  @Query(() => String)
  test() {
    return "I'm working.";
  }
}
