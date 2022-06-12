import { navigate } from "gatsby-link"
import * as React from "react"
import { ServiceContext } from "../../gatsby-browser"
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"
import { ISpotifyArtist, ISpotifyTrack, SpotifyTopItems, SpotifyTopRange } from "../models/spotifyApi"

const ProfilePage = () => {
  const { authService, spotifyService } = React.useContext(ServiceContext)
  if (!authService.isLoggedIn) {
    typeof window != 'undefined' && navigate('/')
    return null
  }
  const [tracksOpen, setTracksOpen] = React.useState(false)
  const [artistsOpen, setArtistsOpen] = React.useState(false)
  const [tracksLoading, setTracksLoading] = React.useState(false)
  const [artistsLoading, setArtistsLoading] = React.useState(false)
  const [spotifySearchRange, setSpotifySearchRange] = React.useState(SpotifyTopRange.shortTerm)
  const scrollAfter = (id: string, ms = 340) => {
    const mainPanel = document.querySelector('main')
    const target = document.getElementById(id)
     if (!mainPanel || !target) {
      return
     }
    setTimeout(() => {
      const y = target.offsetTop - 50
      mainPanel.scrollTo({
        top: y,
        left: 0,
        behavior: 'smooth',
      })
    }, ms)
  }

  const clickArtists = async () => {
    if (!artistsOpen && !spotifyService.topArtistsMap[spotifySearchRange]) {
      setArtistsLoading(true)
      await spotifyService.getTopItems(SpotifyTopItems.artists, spotifySearchRange)
      setArtistsLoading(false)
    }
    setArtistsOpen(!artistsOpen)
    scrollAfter('topArtists')
  }
  const clickTracks = async () => {
    if (!tracksOpen && !spotifyService.topTracksMap[spotifySearchRange]) {
      setTracksLoading(true)
      await spotifyService.getTopItems(SpotifyTopItems.tracks, spotifySearchRange)
      setTracksLoading(false)
    }
    setTracksOpen(!tracksOpen)
    scrollAfter('topTracks')
  }
  const timeFrameMap: {
    [key: string]: string
  } = {
    [SpotifyTopRange.shortTerm]: 'the last 4 weeks',
    [SpotifyTopRange.mediumTerm]: 'the last 6 months',
    [SpotifyTopRange.longTerm]: 'all time',
  }
  const changeTimeFrame = (range: SpotifyTopRange) => {
    if (range == spotifySearchRange) {
      return
    }
    if (tracksOpen && !spotifyService.topTracksMap[range]) {
      setTracksOpen(false)
    }
    if (artistsOpen && !spotifyService.topArtistsMap[range]) {
      setArtistsOpen(false)
    }
    setSpotifySearchRange(range)
  }

  return (
    <>
      <Header />
      <main>
        <section style={{textAlign: 'center'}}>
          <ProfilePicture src={authService.loggedInUser?.displayPicture} name={authService.loggedInUser?.displayName}
            size={ProfilePicSize.full} hCenter={true} />
          <h1>{authService.loggedInUser?.displayName || 'Profile'}</h1>
        </section>
        {/* <p style={{textAlign: 'center'}}>{authService.loggedInUser.displayName}</p> */}
        <div className="searchControl">
          <label htmlFor="timeFrame">Results from:</label>
          <select name="timeFrame" defaultValue={SpotifyTopRange.shortTerm} onChange={(e) => {
            changeTimeFrame(e.target.value as SpotifyTopRange)
          }}>
            <option value={SpotifyTopRange.shortTerm}>{timeFrameMap[SpotifyTopRange.shortTerm]}</option>
            <option value={SpotifyTopRange.mediumTerm}>{timeFrameMap[SpotifyTopRange.mediumTerm]}</option>
            <option value={SpotifyTopRange.longTerm}>{timeFrameMap[SpotifyTopRange.longTerm]}</option>
          </select>
        </div>
        <div className="profileSection" style={{marginTop: '30px'}}>
          <div className="titleSection" onClick={clickTracks}>
            <p id="topTracks" className="itemsTitle">My top tracks</p>
            { tracksLoading && 
              <img className="profileLoadingSpinner imageRotate" src="/static/spotify.svg" alt="spotify icon logo" /> }
          </div>
          { spotifyService.topTracksMap[spotifySearchRange]?.length > 0 &&
            <ul className={`sectionList ${tracksOpen ? "sectionListOpen" : ''}`}>
              { spotifyService.topTracksMap[spotifySearchRange].map((t: ISpotifyTrack, i: number) => {
                  return <TopItem key={i} title={t.name} subTitle={t.name} imageUrl={t.albumImageUrl} />
                }) }
            </ul>
          }
          { tracksOpen && !spotifyService.topTracksMap[spotifySearchRange]?.length && <p>No tracks loaded</p> }
        </div>
        <div className="profileSection">
          <div className="titleSection" onClick={clickArtists}>
            <p id="topArtists" className="itemsTitle">My top artists</p>
            { artistsLoading &&
              <img className="profileLoadingSpinner imageRotate" src="/static/spotify.svg" alt="spotify icon logo" /> }
          </div>
          { spotifyService.topArtistsMap[spotifySearchRange]?.length > 0 &&
            <ul className={`sectionList ${artistsOpen ? "sectionListOpen" : ''}`}>
              { spotifyService.topArtistsMap[spotifySearchRange].map((a: ISpotifyArtist, i: number) => {
                return <TopItem key={i} title={a.name} imageUrl={a.imageUrl} />
              })}
            </ul>
          }
          { artistsOpen && !spotifyService.topArtistsMap[spotifySearchRange]?.length && <p>No artists loaded</p> }
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
