export type ILogin = string | number;

export interface IRole {
  role_name: string;
  id_role: number;
}

export interface IRequestBodyLogin {
  login: ILogin;
  password: string;
}

export interface IUser {
  id: number;
  role: IRole[];
  surname: string;
  name: string;
}

export interface ITokenData {
  id: number;
  r: IRole[];
  s: string;
  n: string;
  idUd?: number;
  exp: number;
}
