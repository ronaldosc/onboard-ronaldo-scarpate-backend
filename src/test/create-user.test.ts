import { CryptoService, HOST, PORT } from '@core';
import { CreateUserInputModel, CreateUserResponseModel, CreateUserUseCase } from '@domain';
import { UserDataSource } from '@source';
import axios, { AxiosResponse, ResponseType } from 'axios';
import { expect } from 'chai';
import { afterEach, before, describe } from 'mocha';
import { Container, Service } from 'typedi';
import { clearRepository } from './index';
import { GraphQLResponse, GraphQLResponseBody } from '@apollo/server/dist/esm/externalTypes/graphql';
import { GraphQLFormattedError } from 'graphql';
import resolvers from "api"
/* 

describe('GraphQL => Unit Testing - Create User use-case', () => {
  let createUser: CreateUserUseCaseTest;
  let repository: UserDataSourceTest;
  let saltTest: string;

  class CreateUserUseCaseTest extends CreateUserUseCase {
    constructor() {
      super((repository = Container.get(UserDataSourceTest)));
    }
    saltTest: string = new CryptoService().generateSalt();

    async execTest(input: CreateUserInputModel & { salt?: typeof saltTest }): Promise<CreateUserResponseModel> {
      const { name, email, birthdate, password } = input;

      return this.repository.saveUser({
        name,
        birthdate: new Date(birthdate).toISOString(),
        email,
        password,
        salt: saltTest,
      });
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
    createUser = new CreateUserUseCaseTest();
    saltTest = createUser.saltTest;
  });

  afterEach(async () => {
    clearRepository();
  });

  it('should create a new valid user', async () => {
    const input = {
      name: 'John',
      email: 'john@example.com',
      birthdate: '2000-01-01',
      password: 'p@ssw0rd',
    };
    const savedUser = await createUser.execTest(input);

    expect(savedUser).to.deep.includes({
      name: 'John',
      email: 'john@example.com',
      birthdate: new Date(input.birthdate).toISOString(),
      salt: saltTest,
    });
    expect(savedUser.id).to.be.a('number').greaterThan(0);
    expect(savedUser.email).to.be.eq(input.email);
    expect(savedUser.birthdate).to.have.lengthOf(24).and.to.not.be.an('object');
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
      expect(err.message).to.be.eq(`Usuário com e-mail '${input.email}' já possui cadastro.`);
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
      expect(err.message).to.be.eq(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
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
      expect(err.message).to.be.eq(`A senha informada não é válida.`);
    }
  });
});

 */

describe('Axios => Integration Testing - Create User use-case', () => {
  class GraphQLEndPoint {
    static getURL(): string {
      const host: string = Container.get(HOST);
      const port: number = Container.get(PORT);
      return `http://${host}:${port}/`;
    }
  }

  
  type GraphRespModel = {
    createUser: CreateUserResponseModel
  }
  type AxiosResp = Pick<AxiosResponse, "data" | "status">
  // type AxiosRespData = Pick<AxiosResponse, "data"> & {errors: any[]}
  
  // let query: string
  let response: AxiosResp
  
  let graphResponse: GraphRespModel & { errors: any[] }
  
  const userEmail = 'jo@example.com';

  let query: object = {//graphql
    mutation: {
      createUser: (input: {
        name: "John",
        email: userEmail,
        birthdate: "2000-01-01",
        password: "p@ssw0rd"
      }) {
        id
        name
        email
        birthdate
      }
    }};
console.log(query & {input: {email: ""}});

  
  // console.log("STRING", `${"\"" + userEmail + "\""}`);


  // afterEach(async () => {
  //   clearRepository();
  //   });


  async function requisition(query: string): Promise<AxiosResp> {
    return axios.post(GraphQLEndPoint.getURL(), { query })
  }

  it('should create a new valid user', async () => {
    const query = `#graphql
    mutation {
      createUser (input: {
        name: "John",
        email: ${"\""+userEmail+"\""},
        birthdate: "2000-01-01",
        password: "p@ssw0rd"
      }) {
        id
        name
        email
        birthdate
      }
    }`;

    const response = await requisition(query)
    expect(response).to.be.not.undefined
    expect(response.status ).to.be.eq(200);
    expect(graphResponse.createUser)
      .to.include({
        name: 'John',
        email: userEmail,
        birthdate: new Date('2000-01-01').toISOString(),
      })
      .and.has.property('id')
      .that.is.a('number')

    // console.dir(response.data.errors[0])
    // response.data.errors[0].message
    // console.log((Array(userEmail).push("\"")));

  });

  it('should throw an error if the email is already in use', async () => {
    const query = `#graphql
    mutation {
      createUser (input: {
        name: "Jo",
        email: ${"\"" + userEmail + "\""},
        birthdate: "2001-11-11",
        password: "p@ssw0rd_"
      }) {
        id
        name
        email
        birthdate
      }
    }`;

    // await axios.post(GraphQLEndPoint.getURL(), { query });

    const response = await axios.post(GraphQLEndPoint.getURL(), { query });
    // graphResponse.createUser
    // const dataReceived: AxiosRespData = response.data
    // console.log(/* dataReceived.errors */ graphResponse.createUser)
    // console.log("TRES", response.data);

    try {
      expect(response).to.be.not.undefined;
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      graphResponse = response.data
      // console.log("DATA" ,dataReceived.errors[0].message);
      // console.log('ERRO', err, 'TERMINA', userEmail);
      expect(graphResponse.errors[0].message).to.be.eq(`Usuário com e-mail '${userEmail}' já possui cadastro.`);
      clearRepository();
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
      // await requisition(input)
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.be.eq(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
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
      // await requisition(input)
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.be.eq(`A senha informada não é válida.`);
    }
  });








  // it('should return a default message', async () => {
  //   const query = `#graphql
  //   query {
  //     test
  //   }`;
  //   const response: AxiosResponse = await axios.post(GraphQLEndPoint.getURL(), { query });

  //   expect(response.status).to.be.eq(200);
  //   expect(response.data.data).to.has.property('test', "I'm working.");
  // });

});
