import { HOST, PORT } from '@core';
import { CreateUserInputModel, CreateUserResponseModel } from '@domain';
import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import { afterEach, describe } from 'mocha';
import { Container } from 'typedi';
import { clearRepository } from './index';

describe('Axios => Integration Testing - Create User use-case', () => {
  class GraphQLEndPoint {
    static getURL(): string {
      const host: string = Container.get(HOST);
      const port: number = Container.get(PORT);
      return `http://${host}:${port}/`;
    }
  }

  type GraphRespModel = {
    createUser: CreateUserResponseModel;
  };
  type AxiosResp = Pick<AxiosResponse, 'data' | 'status' | 'statusText'> & { data: { errors?: any[] } };

  let response: AxiosResp;
  let graphResponse: GraphRespModel & { errors: any[] };
  let input = (user?: Partial<CreateUserInputModel>) => {
    return `#graphql
    mutation {
      createUser (input: { 
        name: "John",
        email: "${user?.email ?? 'jo@example.com'}",
        birthdate: "${user?.birthdate ?? '2000-01-01'}",
        password: "${user?.password ?? 'p@ssw0rd'}"
      }) {
        id
        name
        email
        birthdate
      }
    }`;
  };

  async function requisition(queryInput: string): Promise<AxiosResp> {
    return axios.post(GraphQLEndPoint.getURL(), { query: queryInput });
  }

  afterEach(() => clearRepository());

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

  it('should throw an error if the email is already in use', async () => {
    await requisition(input());
    const {
      data: { graphResponse, errors },
    } = await requisition(input());

    expect(graphResponse).to.be.undefined;
    expect(errors[0].message).to.be.eq(`Usuário com e-mail 'jo@example.com' já possui cadastro.`);
  });

  it('should throw an error if birthdate is less than 15 years ago', async () => {
    const {
      data: { graphResponse, errors },
    } = await requisition(input({ birthdate: '2015' }));

    expect(graphResponse).to.be.undefined;
    expect(errors[0].message).to.be.eq(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
  });

  it('should throw an error if the password is invalid', async () => {
    const {
      data: { graphResponse, errors },
    } = await requisition(input({ password: 'password' }));
    expect(graphResponse).to.be.undefined;
    expect(errors[0].message).to.be.eq(`A senha informada não é válida.`);
  });
});
