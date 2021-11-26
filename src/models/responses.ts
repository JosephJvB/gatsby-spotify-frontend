import { IUser } from "./user";

export interface ITokenResponse {
  token: string
}

export interface IAuthResponse extends IUser {
  message: string
}
