import HttpClient from "../clients/httpClient"

class SpotifyService {
  http: HttpClient
  topTracks: any[]
  topArtists: any[]
  constructor() {
    this.http = new HttpClient()
  }
}

export default new SpotifyService()