import { UserDataSource } from '@db/source';
import { CreateUserInputModel, CreateUserResponseModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class CreateUserUserCase {
  constructor(private readonly repository: UserDataSource) {}

  async exec(input: CreateUserInputModel): Promise<CreateUserResponseModel> {
    const { name, email, birthdate, password } = input;
    const user = await this.repository.findOneByEmail(email);
    const birthFormated = new Date(birthdate);

    if (user) {
      throw new Error(`Usuário com e-mail ${email} já possui cadastro.`);
    }
    if (!birthFormated.getTime()) {
      throw new Error(`A data de nascimento '${birthdate}' não é válida.`);
    }

    return this.repository.saveUser({
      name,
      birthdate: birthFormated.toJSON(),
      email,
      password,
    });
  }
}
