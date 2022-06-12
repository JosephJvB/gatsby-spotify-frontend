import { navigate } from "gatsby-link"
import HttpClient from "../clients/httpClient"
import { AdminSpotifyId, BaseSpotifyApiUrl, JafToken, SpotifyClientId, SpotifyScopes } from "../config"
import { IUser } from "../models/user"

// changes to this class cause hot reload loop between profile and login
// cause is, updating authService but one page (Profile?) still has reference to old AuthService instance
// basically, there's an old authService instance still referenced.
// checked with authService.id = random
export default class AuthService {
  private http: HttpClient
  loggedInUser: IUser | null
  id: number
  constructor(http: HttpClient) {
    this.http = http
    // debugging
    this.id = Math.floor(Math.random() * 500)
  }

  get isAdmin() {
    return this.loggedInUser?.spotifyId == AdminSpotifyId
  }
  get isLoggedIn() {
    return !!this.loggedInUser
  }

  async validateSession(jwt: string): Promise<void> {
    try {
      const {message, token, ...user} = await this.http.validateSession(jwt)
      this.loggedInUser = user
      localStorage.setItem(JafToken, token)
    } catch (e) {
      localStorage.removeItem(JafToken)
      throw e
    }
  }
  async login(spotifyCode: string): Promise<void> {
    const {message, token, ...user} = await this.http.login(spotifyCode)
    this.loggedInUser = user
    localStorage.setItem(JafToken, token)
  }
  async logout(): Promise<void> {
    localStorage.removeItem(JafToken)
    this.loggedInUser = null
    typeof window != 'undefined' && navigate('/')
  }
  get startUrl() {
    return BaseSpotifyApiUrl + 'authorize?' + new URLSearchParams({
      response_type: 'code',
      client_id: SpotifyClientId,
      scope: SpotifyScopes,
      // redirect_uri: 'http://localhost:3000',
      redirect_uri: 'https://jaf-unwrapped.com',
      // redirect_uri: typeof window !== 'undefined' && window.location.origin,
    })
  }
}
