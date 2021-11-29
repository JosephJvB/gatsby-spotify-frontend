import { navigate } from "gatsby-link"
import HttpClient from "../clients/httpClient"
import { BaseSpotifyApiUrl, JafToken, SpotifyClientId, SpotifyScopes } from "../config"
import { LoginRequestData, RegisterRequestData } from "../models/requests"
import { ISpotifyArtist, ISpotifyTrack, SpotifyTopItems } from "../models/spotifyApi"
import { IUser } from "../models/user"

// changes to this class cause hot reload loop between profile and login
// cause is, updating authService but one page (Profile?) still has reference to old AuthService instance
// basically, there's an old authService instance still referenced.
// checked with authService.id = random
class AuthService {
  private http: HttpClient
  loggedInUser: IUser
  id: number
  constructor() {
    this.http = new HttpClient()
    // debugging
    this.id = Math.floor(Math.random() * 500)
  }

  get isLoggedIn() {
    return !!this.loggedInUser
  }
  async getTopItems(type: SpotifyTopItems): Promise<void> {
    const { token, items } = await this.http.getTopItems({
      token: this.loggedInUser.token,
      type
    })
    this.loggedInUser.token = token
    switch (type) {
      case SpotifyTopItems.artists:
        this.loggedInUser.topArtists = items as ISpotifyArtist[]
        break
      case SpotifyTopItems.tracks:
        this.loggedInUser.topTracks = items as ISpotifyTrack[]
        break
    }
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  async validateToken(token: string): Promise<void> {
    try {
      const {message, ...user} = await this.http.validateToken({ token })
      this.loggedInUser = user
      localStorage.setItem(JafToken, this.loggedInUser.token)
    } catch (e) {
      localStorage.removeItem(JafToken)
      throw e
    }
  }
  async login(data: LoginRequestData): Promise<void> {
    const {message, ...user} = await this.http.login(data)
    this.loggedInUser = user
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  async register(data: RegisterRequestData): Promise<void> {
    const {message, ...user} = await this.http.register(data)
    this.loggedInUser = user
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  logout(): void {
    if (this.loggedInUser) {
      localStorage.removeItem(JafToken)
      this.loggedInUser = null
    }
    navigate('/login')
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