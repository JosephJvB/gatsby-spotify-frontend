import { navigate } from "gatsby-link"
import * as React from "react"
import Header from "../components/header"
import Modals from "../components/modals"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import "../main.css"
import { ISpotifyArtist, ISpotifyTrack } from "../models/spotifyApi"
import authService from "../services/authService"
import spotifyService from "../services/spotifyService"

const ProfilePage = () => {
  if (!authService.isLoggedIn) {
    navigate('/login')
    return null
  }
  const [tracksOpen, setTracksOpen] = React.useState(false)
  const [artistsOpen, setArtistsOpen] = React.useState(false)

  return (
    <>
      <Header />
      {/* <Modals /> */}
      <main>
        <section>
          <ProfilePicture size={ProfilePicSize.full} center={true} />
        </section>
        <p style={{textAlign: 'center'}}>{authService.loggedInUser.displayName}</p>
        <div className="profileSection" style={{marginTop: '50px'}}>
          <p onClick={e => setTracksOpen(!tracksOpen)}>My top tracks</p>
          { tracksOpen && authService.loggedInUser.topTracks.length > 0 &&
            <ul className="sectionList">
              { authService.loggedInUser.topTracks.map((t: ISpotifyTrack, i: number) => {
                return <li key={i}>{t.name}</li>
              })}
            </ul>
          }
          { tracksOpen && authService.loggedInUser.topTracks.length == 0 && <p>No tracks loaded</p> }
        </div>
        <div className="profileSection">
          <p onClick={e => setArtistsOpen(!artistsOpen)}>My top artists</p>
          { artistsOpen && authService.loggedInUser.topArtists.length > 0 &&
            <ul className="sectionList">
              { authService.loggedInUser.topArtists.map((t: ISpotifyArtist, i: number) => {
                return <li key={i}>{t.name}</li>
              })}
            </ul>
          }
          { artistsOpen && authService.loggedInUser.topArtists.length == 0 && <p>No artists loaded</p> }
        </div>
      </main>
    </>
  )
}

export default ProfilePage
