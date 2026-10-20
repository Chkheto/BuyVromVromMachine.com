export interface IRegister {
  firstName: string
  lastName: string
  age: number
  email: string
  password: string
  address: string
  phone: string
  gender: string
  zipcode: string
}

export interface ILogIn {
  email: string
  password: string
}

export interface IAuthTokens {
  access_token: string
  refresh_token: string
}
