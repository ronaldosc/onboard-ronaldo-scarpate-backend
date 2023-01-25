import { CreateUserResponseModel } from '@domain/model';
import { CreateUserUseCase } from '@domain/mutation';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateUserInput } from './user.input';
import { UserType } from './user.type';

@Service()
@Resolver()
export class UserResolver {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Mutation(() => UserType)
  createUser(
    @Arg('data')
    input: CreateUserInput,
  ): Promise<CreateUserResponseModel> {
    return this.createUserUseCase.exec(input);
  }

  @Query(() => String)
  test() {
    return "I'm working.";
  }
}
