import { CryptoService, birthValidator, mailValidator, passValidator } from '@core';
import { CreateUserInputModel, CreateUserResponseModel } from '@domain/model';
import { UserDataSource } from '@source';
import { Service } from 'typedi';

@Service()
export class CreateUserUseCase {
  constructor(private readonly repository: UserDataSource, private readonly cryptoService: CryptoService) {}

  async exec(input: CreateUserInputModel): Promise<CreateUserResponseModel> {
    const { name, email, birthdate, password } = input;
    const user = await this.repository.findOneByEmail(email);

    mailValidator(email)

    if (user) {
      throw new Error(`Usuário com e-mail '${email}' já possui cadastro.`);
    }

    birthValidator(birthdate)

    passValidator(password)

    const salt: string = this.cryptoService.generateSalt();
    const hashedPass: string = this.cryptoService.generateHashedPass(password, salt);

    return this.repository.saveUser({
      name,
      birthdate: new Date(birthdate).toISOString(),
      email,
      password: hashedPass,
      salt,
    });
  }
}
