import { navigate } from "gatsby-link"
import * as React from "react"
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"
import "../main.css"
import { ISpotifyArtist, ISpotifyTrack, SpotifyTopItems } from "../models/spotifyApi"
import authService from "../services/authService"

const ProfilePage = () => {
  console.log('profile.authService', authService)
  if (!authService.isLoggedIn) {
    navigate('/login')
    return null
  }
  const [tracksOpen, setTracksOpen] = React.useState(false)
  const [artistsOpen, setArtistsOpen] = React.useState(false)
  const [tracksLoading, setTracksLoading] = React.useState(false)
  const [artistsLoading, setArtistsLoading] = React.useState(false)
  const scrollAfter = (id: string, ms = 340) => {
    const mainPanel = document.querySelector('main')
    setTimeout(() => {
      const y = document.getElementById(id).offsetTop - 50
      mainPanel.scrollTo({
        top: y,
        left: 0,
        behavior: 'smooth',
      })
    }, ms)
  }

  const clickArtists = async () => {
    if (!artistsOpen && !authService.loggedInUser.topArtists) {
      setArtistsLoading(true)
      await authService.getTopItems(SpotifyTopItems.artists)
      setArtistsLoading(false)
    }
    setArtistsOpen(!artistsOpen)
    scrollAfter('topArtists')
  }
  const clickTracks = async () => {
    if (!tracksOpen && !authService.loggedInUser.topTracks) {
      setTracksLoading(true)
      await authService.getTopItems(SpotifyTopItems.tracks)
      setTracksLoading(false)
    }
    setTracksOpen(!tracksOpen)
    scrollAfter('topTracks')
  }

  return (
    <>
      <Header />
      <main>
        <section>
          <ProfilePicture size={ProfilePicSize.full} hCenter={true} />
        </section>
        {/* <p style={{textAlign: 'center'}}>{authService.loggedInUser.displayName}</p> */}
        <div className="profileSection" style={{marginTop: '30px'}}>
          <p id="topTracks" className="itemsTitle" onClick={clickTracks}>My top tracks</p>
          { tracksLoading && <span>loading</span> }
          { authService.loggedInUser.topTracks?.length > 0 &&
            <ul className={`sectionList ${tracksOpen ? "sectionListOpen" : ''}`}>
              { authService.loggedInUser.topTracks.map((t: ISpotifyTrack, i: number) => {
                  return <TopItem key={i} title={t.name} subTitle={t.artists[0]} imageUrl={t.albumImageUrl} />
                }) }
            </ul>
          }
          { tracksOpen && authService.loggedInUser.topTracks?.length == 0 && <p>No tracks loaded</p> }
        </div>
        <div className="profileSection">
          <p id="topArtists" className="itemsTitle" onClick={clickArtists}>My top artists</p>
          { artistsLoading && <span>loading</span> }
          { authService.loggedInUser.topArtists?.length > 0 &&
            <ul className={`sectionList ${artistsOpen ? "sectionListOpen" : ''}`}>
              { authService.loggedInUser.topArtists.map((a: ISpotifyArtist, i: number) => {
                return <TopItem key={i} title={a.name} imageUrl={a.imageUrl} />
              })}
            </ul>
          }
          { artistsOpen && authService.loggedInUser.topArtists?.length == 0 && <p>No artists loaded</p> }
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
