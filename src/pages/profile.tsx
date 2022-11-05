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
}
const profileViews: profileViewState[] = [
  profileViewState.artists,
  profileViewState.tracks,
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
  const [carouselClasses, setCarouselClasses] = React.useState(['active', ''])

  React.useEffect(() => {
    loadCurrentDisplay()
  }, [spotifySearchRange, viewStateIdx])
  
  const loadCurrentDisplay = async () => {
    switch (profileViews[viewStateIdx]) {
      case profileViewState.artists:
        await loadArtists()
        break
      case profileViewState.tracks:
        await loadTracks()
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

  const updateCarousel = (direction: ISwipeDirection, nextViewState: number) => {
    const nextCarouselClasses = carouselClasses.map((c: string, idx: number) => {
      let nextClass = ''
      if (idx == nextViewState) {
        nextClass = direction == 'right' ? 'left' : 'right'
      }
      if (idx == viewStateIdx) {
        nextClass += direction
      }
      return nextClass
    })
    setCarouselClasses(nextCarouselClasses)
      setTimeout(() => {
        setCarouselClasses(nextCarouselClasses.map((c, i) => {
          return i == nextViewState ? 'active' : ''
        }))
      }, 300)
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
      updateCarousel(direction, nextViewState)
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
        <p className="itemsTitle">My top {profileViews[viewStateIdx]}</p>
        { loading &&
          <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" />
        }
        <section className="profileDataView carousel"
          onTouchStart={e => swipeListener.onTouchStart(e.nativeEvent)}
          onTouchMove={e => swipeListener.onTouchMove(e.nativeEvent)}
          onTouchEnd={() => swipeListener.onTouchEnd()}>
          { !loading && profileViews.map((view, idx) => (
            <ul key={view} className={('carousel-item ' + carouselClasses[idx]).trim()}>
              { view == profileViewState.artists &&
                spotifyService.topArtistsMap[spotifySearchRange]?.map((a: ISpotifyArtist, i: number) => (
                  <TopItem key={i} title={a.name} imageUrl={a.images[0].url} popularity={a.popularity}/>
              ))}
              { view == profileViewState.tracks &&
                spotifyService.topTracksMap[spotifySearchRange]?.map((t: ISpotifyTrack, i: number) => (
                  <TopItem key={i} title={t.name} subTitle={t.artists[0].name} imageUrl={t.album.images[0].url} popularity={t.popularity} />
              ))}
            </ul>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
