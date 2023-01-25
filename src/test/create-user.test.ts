import { CryptoService } from '@core/crypto';
import { CRYPTO_KEY_LENGTH, CRYPTO_SECRET } from '@core/env-conf';
import { UserDataSource } from '@db/source';
import { CreateUserUseCase } from '@domain/mutation';
import { expect } from 'chai';
import Container from 'typedi';

describe('GraphQL -> Create User - use-case', () => {
  let createUser: CreateUserUseCase;
  let repository: UserDataSource;
  let cryptoService: CryptoService;

  beforeEach(() => {
    const secret = Container.get(CRYPTO_SECRET);
    const key_length: number = Container.get(CRYPTO_KEY_LENGTH);

    repository = new UserDataSource();
    cryptoService = new CryptoService(secret, key_length);
    createUser = new CreateUserUseCase(repository, cryptoService);
  });

  it('Deve criar um novo usuário', async () => {
    const input = {
      name: 'John',
      email: 'john@example.com',
      birthdate: '2000-01-01',
      password: 'p@ssw0rd',
    };

    const result = await createUser.exec(input);

    expect(result).to.deep.include({
      name: 'Jo',
      email: 'jo@example.com',
      birthdate: '2000-01-01T00:00:00.000Z',
    });
    expect(result.email).to.be.a('string');
    expect(result.birthdate).to.be.a('string');
  });

  it('Deve jogar um erro se o e-mail já estiver em uso', async () => {
    const input = {
      name: 'John',
      email: 'john@example.com',
      birthdate: '2001-11-11',
      password: 'p@ssw0rd',
    };
    await createUser.exec(input);

    try {
      await createUser.exec(input);
      expect.fail('Deve ter arremessado um erro');
    } catch (err: any) {
      expect(err.message).to.equal(`Usuário com e-mail 'john@example.com' já possui cadastro.`);
    }
  });

  it('Deve jogar um erro se a idade for menor que 15 anos', async () => {
    const input = {
      name: 'Maria',
      email: 'maria@example.com',
      birthdate: '2010-01-01',
      password: 'p@ssw0rd',
    };

    try {
      await createUser.exec(input);
      expect.fail('Deve ter arremessado um erro');
    } catch (err: any) {
      expect(err.message).to.equal('Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.');
    }
  });

  it('Deve jogar um erro se a senha for inválida', async () => {
    const input = {
      name: 'Jose',
      email: 'jose@example.com',
      birthdate: '2000-01-01',
      password: 'password',
    };

    try {
      await createUser.exec(input);
      expect.fail('Deve ter arremessado um erro');
    } catch (err: any) {
      expect(err.message).to.equal('A senha informada não é válida.');
    }
  });
});
