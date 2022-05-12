import { navigate } from "gatsby-link"
import HttpClient from "../clients/httpClient"
import { AdminSpotifyId, BaseSpotifyApiUrl, JafToken, SessionToken, SpotifyClientId, SpotifyScopes } from "../config"
import { ILoginRequestData, IRegisterRequestData } from "../models/requests"
import { IUser } from "../models/user"

// changes to this class cause hot reload loop between profile and login
// cause is, updating authService but one page (Profile?) still has reference to old AuthService instance
// basically, there's an old authService instance still referenced.
// checked with authService.id = random
export default class AuthService {
  private http: HttpClient
  loggedInUser: IUser
  id: number
  constructor() {
    this.http = new HttpClient()
    // debugging
    this.id = Math.floor(Math.random() * 500)
  }

  get isAdmin() {
    return this.loggedInUser?.spotifyId == AdminSpotifyId
  }
  get isLoggedIn() {
    return !!this.loggedInUser
  }

  async validateSession(sessionJwt: string): Promise<void> {
    try {
      const {message, token, ...user} = await this.http.validateSession({ token: sessionJwt })
      this.loggedInUser = user
      localStorage.setItem(JafToken, token)
    } catch (e) {
      localStorage.removeItem(SessionToken)
      throw e
    }
  }
  async login(data: ILoginRequestData): Promise<void> {
    const {message, token, sessionToken, ...user} = await this.http.login(data)
    this.loggedInUser = user
    localStorage.setItem(JafToken, token)
    if (sessionToken) {
      localStorage.setItem(SessionToken, sessionToken)
    } else {
      localStorage.removeItem(SessionToken)
    }
  }
  async register(data: IRegisterRequestData): Promise<void> {
    const {message, token, sessionToken, ...user} = await this.http.register(data)
    this.loggedInUser = user
    localStorage.setItem(JafToken, token)
    if (sessionToken) {
      localStorage.setItem(SessionToken, sessionToken)
    } else {
      localStorage.removeItem(SessionToken)
    }
  }
  async logout(): Promise<void> {
    const sessionToken = localStorage.getItem(SessionToken)
    localStorage.removeItem(JafToken)
    if (sessionToken) {
      localStorage.removeItem(SessionToken)
      await this.http.deleteSession({ token: sessionToken })
    }
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
