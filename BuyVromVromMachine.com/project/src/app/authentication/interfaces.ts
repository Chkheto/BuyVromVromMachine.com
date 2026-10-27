export interface IAuthTokens {
  access_token: string;
  refresh_token?: string;
  token?: string;
}

export interface ILogIn {
  email: string;
  password: string;
}

export interface IRegister {
  fullName: string;
  email: string;
  password: string;
  zipcode?: string;
  avatar?: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user: IUser;
}