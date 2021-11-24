export interface LoginRequestData {
  email: string
  password: string
}
export interface RegisterRequestData {
  email: string
  password: string
  passwordConfirm: string
  spotifyCode: string
}
export interface SpotifyCodeRequest extends TokenRequest {
  code: string
}

export interface TokenRequest {
  token: string
}