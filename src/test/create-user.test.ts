import { CreateUserInputModel, CreateUserResponseModel } from '@domain';
import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import { afterEach, describe } from 'mocha';
import { GraphQLEndPoint, clearRepository } from './index';

type GraphRespModel = {
  createUser: CreateUserResponseModel;
};
type AxiosResp = Pick<AxiosResponse, 'data' | 'status' | 'statusText'> & { data: { errors?: any[] } };

async function requisition(query: string): Promise<AxiosResp> {
  return axios.post(GraphQLEndPoint.getURL(), { query });
}

describe('Axios => Integration Testing - Create User Use-Case', () => {
  let graphResponse: GraphRespModel;
  const input = (user?: Partial<CreateUserInputModel>) => {
    return `#graphql
    mutation {
      createUser(input: { 
        name:
            "John",
        email:
            "${user?.email ?? 'jo@example.com'}",
        birthdate:
            "${user?.birthdate ?? '2000-01-01'}",
        password:
            "${user?.password ?? 'p@ssw0rd'}"
      }) {
        id
        name
        email
        birthdate
      }
    }`;
  };

  it('should create a new valid user', async () => {
    const {
      status,
      data: { data: graphResponse },
    } = await requisition(input());

    expect(status).to.be.eq(200);
    expect(graphResponse.createUser)
      .to.include({
        name: 'John',
        email: 'jo@example.com',
        birthdate: new Date('2000-01-01').toISOString(),
      })
      .and.has.property('id')
      .that.is.a('number');
  });

  it('should throw an error if the email is not provided', async () => {
    await requisition(input());
    const {
      data: { graphResponse, errors },
    } = await requisition(input({ email: '' }));

    expect(graphResponse).to.be.undefined;
    expect(errors).to.have.lengthOf(1);
    expect(errors[0].message).to.be.eq(`Campo e-mail obrigatório.`);
  });

  it('should throw an error if the email is already in use', async () => {
    const userEmail = { email: 'john@teste.com' };
    await requisition(input(userEmail));
    const {
      data: { graphResponse, errors },
    } = await requisition(input(userEmail));

    expect(graphResponse).to.be.undefined;
    expect(errors).to.have.lengthOf(1);
    expect(errors[0].message).to.be.eq(`Usuário com e-mail '${userEmail.email}' já possui cadastro.`);
  });

  it('should throw an error if birthdate is less than 15 years ago', async () => {
    const {
      data: { graphResponse, errors },
    } = await requisition(input({ birthdate: '2015' }));

    expect(graphResponse).to.be.undefined;
    expect(errors).to.have.lengthOf(1);
    expect(errors[0].message).to.be.eq(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
  });

  it('should throw an error if the password is invalid', async () => {
    const {
      data: { graphResponse, errors },
    } = await requisition(input({ password: 'password' }));
    expect(graphResponse).to.be.undefined;
    expect(errors).to.have.lengthOf(1);
    expect(errors[0].message).to.be.eq(`A senha informada não é válida.`);
  });

  afterEach(() => clearRepository());
});

describe('Axios => Integration Testing - Default Query String', () => {
  it('should return a default query message', async () => {
    const {
      status,
      data: { data: queryTesting },
    } = await requisition(
      `#graphql
          query {
            test
          }`,
    );

    expect(status).to.be.eq(200);
    expect(queryTesting).to.has.property('test', "I'm working.");
  });
});
