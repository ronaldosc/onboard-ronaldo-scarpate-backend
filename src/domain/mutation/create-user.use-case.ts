import { CryptoService, birthValidator, passValidator } from '@core';
import { CreateUserInputModel, CreateUserResponseModel } from '@domain/model';
import { UserDataSource } from '@source';
import { Service } from 'typedi';

@Service()
export class CreateUserUseCase {
  constructor(private readonly repository: UserDataSource, private readonly cryptoService: CryptoService) {}

  async exec(input: CreateUserInputModel): Promise<CreateUserResponseModel> {
    const { name, email, birthdate, password } = input;
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

    const salt: string = this.cryptoService.generateSalt();
    const hashedPass: string = this.cryptoService.generateSaltedPass(password, salt);

    return this.repository.saveUser({
      name,
      birthdate: new Date(birthdate).toISOString(),
      email,
      password: hashedPass,
      salt,
    });
  }
}
