import { navigate } from "gatsby-link"
import HttpClient from "../clients/httpClient"
import { BaseSpotifyApiUrl, JafToken, SpotifyClientId, SpotifyScopes } from "../config"
import { LoginRequestData, RegisterRequestData, TokenRequest } from "../models/requests"
import { ISpotifyArtist, ISpotifyTrack, SpotifyTopItems } from "../models/spotifyApi"
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
  async getTopItems(type: SpotifyTopItems): Promise<void> {
    const res = await this.http.getTopItems({
      token: this.loggedInUser.token,
      type
    })
    this.loggedInUser.token = res.token
    switch (type) {
      case SpotifyTopItems.artists:
        this.loggedInUser.topArtists = res.items as ISpotifyArtist[]
        break
      case SpotifyTopItems.tracks:
        this.loggedInUser.topTracks = res.items as ISpotifyTrack[]
        break
    }
    localStorage.setItem(JafToken, this.loggedInUser.token)
  }
  async validateToken(token: string): Promise<void> {
    try {
      this.loggedInUser = await this.http.validateToken({ token })
      localStorage.setItem(JafToken, this.loggedInUser.token)
    } catch (e) {
      localStorage.removeItem(JafToken)
      throw e
    }
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