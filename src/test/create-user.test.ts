import { CRYPTO_KEY_LENGTH, CRYPTO_SECRET, CryptoService } from '@core';
import { dataORM } from '@db/dbconfig';
import { UserDataSource } from '@db/source';
import { CreateUserInputModel, CreateUserUseCase } from '@domain';
import { User } from '@entities';
import { expect } from 'chai';
import { afterEach, before, describe, it } from 'mocha';
import { Container, Service } from 'typedi';

/*  const secret = Container.get(CRYPTO_SECRET);
    const key_length: number = Container.get(CRYPTO_KEY_LENGTH);
    repository = new UserDataSource();
    cryptoService = new CryptoService(secret, key_length);
    createUser = new CreateUserUseCase(repository, cryptoService);
  }); */

describe('GraphQL -> Unit Test - Create user use-case', () => {
  // let cryptoService: CryptoService = new CryptoService().generateSalt()
  let saltTest: string
  let cryptoService: CryptoService = new CryptoService(Container.get(CRYPTO_SECRET), Container.get(CRYPTO_KEY_LENGTH))
  let repository: UserDataSourceTest;
  let createUser: CreateUserUseCase;
  
  class CreateUserUseCaseTest extends CreateUserUseCase {
    saltTest: string = this.salt
    constructor() {
      super(repository, cryptoService);
    }
  }

  console.log("PASSEI AQUI -describe ");

  @Service()
  class UserDataSourceTest extends UserDataSource {
    // private readonly salt = new SaltTest().saltTest  
    override saveUser(user: CreateUserInputModel) {
      saltTest = new CreateUserUseCaseTest().saltTest

      console.count("Salt criado:")

      Object.assign(user, { salt: saltTest })
      return this.userRepository.save({ ...user });
    }
  }

 

  before(() => {
    repository = Container.get(UserDataSourceTest);
    createUser = new CreateUserUseCaseTest();
  });
  
  afterEach(async () => {
    await dataORM.getRepository(User).clear();
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
      name: 'John',
      email: 'john@example.com',
      birthdate: '2000-01-01T00:00:00.000Z',
      salt: saltTest,
    });
    expect(result.email).to.be.a('string');
    expect(result.birthdate).to.be.a('string');
  });

  it('Deve jogar um erro se o e-mail já estiver em uso', async () => {
    const input = {
      name: 'Jo',
      email: 'jo@example.com',
      birthdate: '2001-11-11',
      password: 'p@ssw0rd',
      salt: saltTest,
    };
    await repository.saveUser(input);

    try {
      await createUser.exec(input);
      expect.fail('Deve ter arremessado um erro');
    } catch (err: any) {
      expect(err.message).to.equal(`Usuário com e-mail 'jo@example.com' já possui cadastro.`);
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
