import { CryptoService, birthValidator, passValidator } from '@core';
import { UserDataSource } from '@db';
import { CreateUserInputModel, CreateUserResponseModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class CreateUserUseCase {
  constructor(protected readonly repository: UserDataSource, protected readonly cryptoService: CryptoService) {}

  async exec(input: CreateUserInputModel): Promise<CreateUserResponseModel> {
    const { name, email, birthdate, password } = input;
    const salt: string = this.cryptoService.generateSalt();
    const user = await this.repository.findOneByEmail(email);

    if (user) {
      throw new Error(`Usuário com e-mail '${email}' já possui cadastro.`);
    }

    if (!birthValidator(birthdate)) {
      throw new Error(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
    }

    if (!passValidator(password)) {
      throw new Error(`A senha informada não é válida.`);
    }

    const hashedPass = this.cryptoService.generateSaltedPass(password, salt);

    return this.repository.saveUser({
      name,
      birthdate: new Date(birthdate).toJSON(),
      email,
      password: hashedPass,
      salt,
    });
  }
}
