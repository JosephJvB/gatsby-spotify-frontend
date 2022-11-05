import { navigate } from "gatsby-link"
import { ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import * as React from "react"
import { ServiceContext } from "../../gatsby-browser"
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"
import SwipeListener, { ISwipeCoords, ISwipeDirection } from '../helpers/swipe'
import spotifySvg from '../images/spotify.svg'

enum profileViewState {
  artists = 'artists',
  tracks = 'tracks',
  audioFeatures = 'audioFeatures',
}
const profileViews: profileViewState[] = [
  profileViewState.artists,
  profileViewState.tracks,
  // disabled
  // issue: if tracks aren't loaded, we can't load audio features
  // audio features need to be a option from the tracks view - so we can be certain tracks have loaded
  // profileViewState.audioFeatures,
]

const ProfilePage = () => {
  const { authService, spotifyService } = React.useContext(ServiceContext)
  if (!authService.isLoggedIn) {
    typeof window != 'undefined' && navigate('/')
    return null
  }
  const [spotifySearchRange, setSpotifySearchRange] = React.useState(SpotifyTopRange.shortTerm)

  const [loading, setLoading] = React.useState(true)
  const [viewStateIdx, setViewStateIdx] = React.useState(0)

  const loadCurrentDisplay = async () => {
    switch (profileViews[viewStateIdx]) {
      case profileViewState.artists:
        await loadArtists()
        break
      case profileViewState.tracks:
        await loadTracks()
        break
      case profileViewState.audioFeatures:
        await loadAudioFeatures()
        break
    }
  }

  const scrollToLastItem = () => {
    // could use refs to make it more react-like but I'm OK with this for now
    const allListItems = document.querySelectorAll('li')
    const lastItem = allListItems[allListItems.length - 1]
    lastItem.scrollIntoView({
      behavior: 'smooth',
    })
  }

  React.useEffect(() => {
    loadCurrentDisplay()
  }, [spotifySearchRange, viewStateIdx])

  const loadArtists = async () => {
    if (spotifyService.topArtistsMap[spotifySearchRange]) {
      return
    }
    setLoading(true)
    await spotifyService.getTopItems(SpotifyItemType.artists, spotifySearchRange)
    setLoading(false)
    scrollToLastItem()
  }
  const loadTracks = async () => {
    if (spotifyService.topTracksMap[spotifySearchRange]) {
      return
    }
    setLoading(true)
    await spotifyService.getTopItems(SpotifyItemType.tracks, spotifySearchRange)
    setLoading(false)
    scrollToLastItem()
  }
  const loadAudioFeatures = async () => {
    if (spotifyService.audioFeaturesMap[spotifySearchRange]) {
      return
    }
    setLoading(true)
    await spotifyService.getAudioFeatures(spotifySearchRange)
    setLoading(false)
    scrollToLastItem()
  }
  const changeTimeFrame = (range: SpotifyTopRange) => {
    if (range == spotifySearchRange) {
      return
    }
    setSpotifySearchRange(range)
  }

  const swipeListener = new SwipeListener(['left', 'right'], (direction: ISwipeDirection) => {
    if (loading) {
      return
    }
    let nextViewState = viewStateIdx
    if (direction == 'right') {
      nextViewState--
    }
    if (direction == 'left') {
      nextViewState++
    }
    if (nextViewState > profileViews.length - 1) {
      nextViewState = 0
    }
    if (nextViewState < 0) {
      nextViewState = profileViews.length - 1
    }
    if (nextViewState != viewStateIdx) {
      setViewStateIdx(nextViewState)
    }
  })

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
            <option value={SpotifyTopRange.shortTerm}>4 weeks</option>
            <option value={SpotifyTopRange.mediumTerm}>6 months</option>
            <option value={SpotifyTopRange.longTerm}>all time</option>
          </select>
        </div>
        <section className="profileDataView"
          onTouchStart={e => swipeListener.onTouchStart(e)}
          onTouchMove={e => swipeListener.onTouchMove(e)}
          onTouchEnd={() => swipeListener.onTouchEnd()}
        >
          {/* artists */}
          { profileViews[viewStateIdx] == profileViewState.artists &&
            <>
              <p id="topArtists" className="itemsTitle">My top artists</p>
              { loading &&
                <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" />
              }
              { !loading && spotifyService.topArtistsMap[spotifySearchRange]?.length > 0 &&
                <ul className="myDataList">
                  { spotifyService.topArtistsMap[spotifySearchRange].map((a: ISpotifyArtist, i: number) => {
                    return <TopItem key={i} title={a.name} imageUrl={a.images[0].url} popularity={a.popularity}/>
                  })}
                </ul>
              }
              { !loading && !spotifyService.topArtistsMap[spotifySearchRange]?.length && <p>No artists loaded</p> }
            </>
          }
          {/* tracks */}
          { profileViews[viewStateIdx] == profileViewState.tracks &&
            <>
              <p id="topTracks" className="itemsTitle">
                My top tracks
                {/* todo */}
                {/* { !loading && <span onClick={...}>Show track breakdown</span> } */}
              </p>
              { loading &&
                <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" />
              }
              { !loading && spotifyService.topTracksMap[spotifySearchRange]?.length > 0 &&
                <ul className="myDataList">
                  { spotifyService.topTracksMap[spotifySearchRange].map((t: ISpotifyTrack, i: number) => {
                      return <TopItem key={i} title={t.name} subTitle={t.artists[0].name} imageUrl={t.album.images[0].url} popularity={t.popularity} />
                  })}
                </ul>
              }
              { !loading && !spotifyService.topTracksMap[spotifySearchRange]?.length && <p>No tracks loaded</p> }
            </>
          }
          {/* audioFeatures */}
          { profileViews[viewStateIdx] == profileViewState.audioFeatures &&
            <>
              <p id="topTracks" className="itemsTitle">My music breakdown</p>
              { loading &&
                <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" />
              }
              { !loading && spotifyService.audioFeaturesMap[spotifySearchRange]?.length > 0 &&
                <ul className="myDataList">
                  { spotifyService.audioFeaturesMap[spotifySearchRange].map(feature => {
                    return <li key={feature.featureName}>{feature.label}: {feature.value}</li>
                  })}
                </ul>
              }
              { !loading && !spotifyService.audioFeaturesMap[spotifySearchRange] && <p>No track features loaded</p> }
            </>
          }
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
