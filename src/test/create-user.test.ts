import { CryptoService } from '@core';
import { Database } from '@db/dbconfig';
import { UserDataSource } from '@db/source';
import { CreateUserInputModel, CreateUserUseCase } from '@domain';
import { User } from '@entities';
import { expect } from 'chai';
import { before, describe } from 'mocha';
import { Container, Service } from 'typedi';

describe('GraphQL => Unit Test - Create User use-case', () => {
  let cryptoService: CryptoService = Container.get(CryptoService); // TODO talvez mover essa linha aqui para 'before'
  let saltTest: string;
  let repository: UserDataSourceTest;
  let createUser: CreateUserUseCase;

  class CreateUserUseCaseTest extends CreateUserUseCase {
    constructor() {
      super(repository, cryptoService);
    }
  }

  @Service()
  class UserDataSourceTest extends UserDataSource {
    override async saveUser(user: CreateUserInputModel) {
      Object.assign(user, { salt: saltTest });
      return this.userRepository.save({ ...user });
    }
  }

  before(() => {
    saltTest = cryptoService.generateSalt();
    repository = Container.get(UserDataSourceTest);
    createUser = new CreateUserUseCaseTest();
  });

  afterEach(async () => {
    await Database.dataORM.getRepository(User).clear();
  });

  it('should create a new user', async () => {
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
      birthdate: new Date(input.birthdate).toISOString(),
      salt: saltTest,
    });
    expect(result.email).to.be.a('string');
    expect(result.birthdate).to.be.a('string');
  });

  it('should throw an error if the email is already in use', async () => {
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
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.be.equal(`Usuário com e-mail '${input.email}' já possui cadastro.`);
    }
  });

  it('should throw an error if birthdate is less than 15 years ago', async () => {
    const input = {
      name: 'Maria',
      email: 'maria@example.com',
      birthdate: '2010-01-01',
      password: 'p@ssw0rd',
    };

    try {
      await createUser.exec(input);
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.be.equal(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
    }
  });

  it('should throw an error if the password is invalid', async () => {
    const input = {
      name: 'Jose',
      email: 'jose@example.com',
      birthdate: '2000-01-01',
      password: 'password',
    };

    try {
      await createUser.exec(input);
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.be.equal(`A senha informada não é válida.`);
    }
  });
});
