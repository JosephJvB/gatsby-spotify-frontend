import { navigate } from "gatsby-link"
import { ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import * as React from "react"
import { ServiceContext } from "../../gatsby-browser"
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"
import SwipeListener, { ISwipeCoords } from '../helpers/swipe'
import spotifySvg from '../images/spotify.svg'

enum profileViewState {
  artists = 'artists',
  tracks = 'tracks',
  audioFeatures = 'audioFeatures',
}
interface IProfileView {
  name: profileViewState
  data: {
    [range: string]: (ISpotifyArtist | ISpotifyTrack)[]
  },
  dataLoader: () => Promise<void>
}

const ProfilePage = () => {
  const { authService, spotifyService } = React.useContext(ServiceContext)
  if (!authService.isLoggedIn) {
    typeof window != 'undefined' && navigate('/')
    return null
  }

  const [spotifySearchRange, setSpotifySearchRange] = React.useState(SpotifyTopRange.shortTerm)
  const [activeClass, setActiveClass] = React.useState('exit-left')

  const [loading, setLoading] = React.useState(true)
  const [viewStateIdx, setViewStateIdx] = React.useState(0)

  const scrollToLastItem = () => {
    // could use refs to make it more react-like but I'm OK with this for now
    const allListItems = document.querySelectorAll('li')
    const lastItem = allListItems[allListItems.length - 1]
    lastItem.scrollIntoView({
      behavior: 'smooth',
    })
  }

  React.useEffect(() => {
    profileViews[viewStateIdx].dataLoader()
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

  const swipeListener = new SwipeListener((coords: ISwipeCoords) => {
    if (loading) {
      return
    }
    const diffX = coords.endX - coords.startX
    const diffY = coords.endY - coords.startY
    // assume vertical swipe event
    if (Math.abs(diffY) > Math.abs(diffX) || Math.abs(diffX) < 10) {
      return
    }
    let nextViewState = viewStateIdx
    let nextActiveClass = 'exit-'
    let nextInActiveClass = 'enter-'
    // right
    if (diffX > 0) {
      nextActiveClass += 'right'
      nextViewState--
    }
    // left
    if (diffX < 0) {
      nextActiveClass += 'left'
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
      setActiveClass(nextActiveClass)
    }
  })

  const profileViews: IProfileView[] = [
    {
      name: profileViewState.artists,
      data: spotifyService.topArtistsMap,
      dataLoader: loadArtists,
    },
    {
      name: profileViewState.tracks,
      data: spotifyService.topTracksMap,
      dataLoader: loadTracks,
    },
  ]

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
          { profileViews.map(view => {
            let dataViewClass = 'myDataView carousel-item'
            if (view == profileViews[viewStateIdx]) {
              dataViewClass += ' active'
            } else {
              dataViewClass += ' ' + activeClass
            }
            return <div key={view.name} className={dataViewClass}>
              <p className="itemsTitle">My top {view.name}</p>
              { loading &&
                <img className="profileLoadingSpinner imageRotate" src={spotifySvg} alt="spotify icon logo" />
              }
              { !loading && view.data[spotifySearchRange]?.length &&
                <ul className="myDataList">
                  {view.data[spotifySearchRange].map((item: (ISpotifyArtist | ISpotifyTrack), i: number) => {
                    if (view.name == profileViewState.artists) {
                      const a: ISpotifyArtist = item as ISpotifyArtist
                      return <TopItem key={i} title={a.name} imageUrl={a.images[0].url} popularity={a.popularity}/>
                    }
                    if (view.name == profileViewState.tracks) {
                      const t: ISpotifyTrack = item as ISpotifyTrack
                      return <TopItem key={i} title={t.name} subTitle={t.artists[0].name} imageUrl={t.album.images[0].url} popularity={t.popularity} />
                    }
                  })}
                </ul>
              }
            </div>
          })}
          {/* audioFeatures */}
          {/* { profileViews[viewStateIdx] == profileViewState.audioFeatures &&
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
          } */}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
