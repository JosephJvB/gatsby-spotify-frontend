import { navigate } from "gatsby-link"
import { ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import * as React from "react"
import { ServiceContext } from "../../gatsby-browser"
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"
import spotifySvg from '../images/spotify.svg'

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

  const loadArtists = async () => {
    if (!artistsOpen && !spotifyService.topArtistsMap[spotifySearchRange]) {
      setArtistsLoading(true)
      await spotifyService.getTopItems(SpotifyItemType.artists, spotifySearchRange)
      setArtistsLoading(false)
    }
    setArtistsOpen(!artistsOpen)
    scrollAfter('topArtists')
  }
  const loadTracks = async () => {
    if (!tracksOpen && !spotifyService.topTracksMap[spotifySearchRange]) {
      setTracksLoading(true)
      await spotifyService.getTopItems(SpotifyItemType.tracks, spotifySearchRange)
      setTracksLoading(false)
    }
    setTracksOpen(!tracksOpen)
    scrollAfter('topTracks')
  }
  const loadAudioFeatures = async () => {
    // if (!tracksOpen && !spotifyService.audioFeaturesMap[spotifySearchRange]) {
    //   setTracksLoading(true)
    //   await spotifyService.getAudioFeatures(spotifySearchRange)
    //   setTracksLoading(false)
    // }
    // setTracksOpen(!tracksOpen)
    // scrollAfter('topTracks')
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
            <option value={SpotifyTopRange.shortTerm}>the last 4 weeks</option>
            <option value={SpotifyTopRange.mediumTerm}>the last 6 months</option>
            <option value={SpotifyTopRange.longTerm}>all time</option>
          </select>
        </div>
        <div className="profileSection" style={{marginTop: '30px'}}>
          <div className="titleSection" onClick={loadTracks}>
            <p id="topTracks" className="itemsTitle">My top tracks</p>
            { tracksLoading && 
              <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" /> }
          </div>
          { spotifyService.topTracksMap[spotifySearchRange]?.length > 0 &&
            <ul className={`sectionList ${tracksOpen ? "sectionListOpen" : ''}`}>
              { spotifyService.topTracksMap[spotifySearchRange].map((t: ISpotifyTrack, i: number) => {
                  return <TopItem key={i} title={t.name} subTitle={t.artists[0].name} imageUrl={t.album.images[0].url} popularity={t.popularity} />
                }) }
            </ul>
          }
          { tracksOpen && !spotifyService.topTracksMap[spotifySearchRange]?.length && <p>No tracks loaded</p> }
        </div>
        <div className="profileSection">
          <div className="titleSection" onClick={loadArtists}>
            <p id="topArtists" className="itemsTitle">My top artists</p>
            { artistsLoading &&
              <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" /> }
          </div>
          { spotifyService.topArtistsMap[spotifySearchRange]?.length > 0 &&
            <ul className={`sectionList ${artistsOpen ? "sectionListOpen" : ''}`}>
              { spotifyService.topArtistsMap[spotifySearchRange].map((a: ISpotifyArtist, i: number) => {
                return <TopItem key={i} title={a.name} imageUrl={a.images[0].url} popularity={a.popularity}/>
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
