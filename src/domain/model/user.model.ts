export interface UserModel {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  password: string;
}

export type CreateUserInputModel = Omit<UserModel, 'id'>;

export type CreateUserResponseModel = Omit<UserModel, 'password'>;
