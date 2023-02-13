export interface UserModel {
  id?: number;
  name: string;
  email: string;
  birthdate: string;
  password?: string;
}

type CreateUserProtoModel = Omit<UserModel, 'id' | 'password'>;

export type CreateUserInputModel = CreateUserProtoModel & Required<Pick<UserModel, 'password'>>;

export type CreateUserResponseModel = CreateUserProtoModel & Required<Pick<UserModel, 'id'>>;
