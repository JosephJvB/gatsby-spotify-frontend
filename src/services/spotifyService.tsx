import HttpClient from "../clients/httpClient"

class SpotifyService {
  http: HttpClient
  topTracks: any[]
  topArtists: any[]
  constructor() {
    this.http = new HttpClient()
  }

  async loadTopTracks(token: string) {
    if (this.topTracks.length) {
      return this.topTracks
    }
    this.topTracks = await this.http.getTopTracks(token)
  }
  // async loadTopArtists(token: string) {
  //   if (this.topTracks.length) {
  //     return this.topTracks
  //   }
  //   this.topTracks = await this.http.getTopTracks(token)
  // }
}

export default new SpotifyService()