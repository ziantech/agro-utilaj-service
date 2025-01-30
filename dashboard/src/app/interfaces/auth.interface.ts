export interface AuthFields {
  email: string;
  password: string;
}
export interface IAuthResponse {
    message: string;
    token: string;
    refreshToken: string;
    id:string;
}

export interface ILoginInterface {
  email: string;
  password: string;
}

export interface ForgotField {
  email: string;
}

export interface IForgotPasswordInterface {
  email: string;
}

export interface IForgotResponse {
  message: string;
}

export interface IResetPasswordInterface {
  password: string;
  token: string;
}
export interface IResetResponse {
  message:string;
}
