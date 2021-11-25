import HttpClient from "../clients/httpClient"
import { BaseSpotifyApiUrl, JafToken, SpotifyClientId, SpotifyScopes } from "../config"
import { LoginRequestData, RegisterRequestData, TokenRequest } from "../models/requests"
import { IUser } from "../models/user"

class AuthService {
  private http: HttpClient
  loggedInUser: IUser
  constructor() {
    this.http = new HttpClient()
  }

  get isLoggedIn() {
    return !!this.loggedInUser
  }
  async validateToken(data: TokenRequest): Promise<void> {
    this.loggedInUser = await this.http.validateToken(data)
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  async login(data: LoginRequestData): Promise<void> {
    this.loggedInUser = await this.http.login(data)
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  async register(data: RegisterRequestData): Promise<void> {
    this.loggedInUser = await this.http.register(data)
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  logout(): void {
    if (this.loggedInUser) {
      localStorage.removeItem(JafToken)
      this.loggedInUser = null
    }
  }
  get startUrl() {
    return BaseSpotifyApiUrl + 'authorize?' + new URLSearchParams({
      response_type: 'code',
      client_id: SpotifyClientId,
      scope: SpotifyScopes,
      redirect_uri: window.location.origin + '/login',
    })
  }
}

export default new AuthService()