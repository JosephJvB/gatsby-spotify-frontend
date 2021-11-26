import { navigate } from "gatsby-link"
import * as React from "react"
import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import "../main.css"
import { ISpotifyTrack } from "../models/spotifyApi"
import authService from "../services/authService"
import spotifyService from "../services/spotifyService"

const ProfilePage = () => {
  if (!authService.isLoggedIn) {
    navigate('/login')
    return null
  }
  const [tracksOpen, setTracksOpen] = React.useState(false)
  const [artistsOpen, setArtistsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [topTracks, setTopTracks] = React.useState<ISpotifyTrack[]>([])
  // const [topArtists, setTopArtists] = React.useState([])

  React.useEffect(() => {
    loadTopTypes()
  }, [])
  async function loadTopTypes() {
    setLoading(true)
    try {
      const [tracks, artists] = await Promise.all([
        spotifyService.loadTopTracks(authService.loggedInUser.token)
      ])
      setTopTracks(tracks)
      // setTopArtists(artists)
    } catch (e) {
      console.error(e)
      console.error('failed to load top types')
    }
    setLoading(false)
  }
  return (
    <>
      <Header />
      <main style={{justifyContent: 'center'}}>
        <title>Profile</title>
        <div style={{margin: '30px auto'}}>
          <ProfilePicture size={ProfilePicSize.full}/>
        </div>
        <p style={{textAlign: 'center'}}>{authService.loggedInUser.displayName}</p>
        <div className="profileSection" style={{marginTop: '50px'}}>
          <p onClick={e => setTracksOpen(!tracksOpen)}>My top tracks</p>
          { tracksOpen && loading && <span>spinner</span>}
          { tracksOpen && !loading && topTracks.length > 0 &&
            <ul className="sectionList">
              { topTracks.map((t: ISpotifyTrack) => <li>{t.name}</li>) }
            </ul>
          }
          { tracksOpen && !loading && topTracks.length == 0 && <p>No tracks loaded</p> }
        </div>
        <div className="profileSection">
          <p onClick={e => setArtistsOpen(!artistsOpen)}>My top artists</p>
          {/* { artistsOpen && loading && <span>spinner</span>}
          { !loading && topArtists.length
            ? <ul className="sectionList">
                { topArtists.map((t: ISpotifyTrack) => <li>{t.name}</li>) }
              </ul>
            : <p>No Top Artists</p>
          } */}
        </div>
      </main>
    </>
  )
}

export default ProfilePage
