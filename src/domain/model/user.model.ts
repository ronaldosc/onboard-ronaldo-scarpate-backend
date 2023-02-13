interface ProtoUserModel {
  name: string;
  email: string;
  birthdate: string;
}

export interface UserModel extends ProtoUserModel {
  id?: number;
  password?: string;
}

export type CreateUserInputModel = ProtoUserModel & { password: string };

export type CreateUserResponseModel = ProtoUserModel & { id: number };
