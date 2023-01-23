import { CryptoService } from '@core/crypto';
import { birthValidator, passValidator } from '@core/validators';
import { UserDataSource } from '@db/source';
import { CreateUserInputModel, CreateUserResponseModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class CreateUserUserCase {
  private readonly salt = this.CryptoService.generateSalt() ?? 'defaultSalt';

  constructor(private readonly repository: UserDataSource, private readonly CryptoService: CryptoService) {}

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

    const hashedPass = this.CryptoService.generateSaltedPass(password, this.salt);

    return this.repository.saveUser({
      name,
      birthdate: new Date(birthdate).toJSON(),
      email,
      password: hashedPass,
      salt: this.salt,
    });
  }
}
