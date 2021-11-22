export interface LoginRequestData {
  email: string
  password: string
  passwordConfirm?: string
  spotifyCode?: string
}
export interface SpotifyCodeRequest {
  code: string
  token: string
}