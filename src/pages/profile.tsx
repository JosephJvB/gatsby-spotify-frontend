import { navigate } from "gatsby-link"
import { ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import * as React from "react"
import { ServiceContext } from "../../gatsby-browser"
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"
import SwipeListener, { ISwipeCoords, ISwipeDirection } from '../helpers/swipe'

const CHUNK_SIZE = 10

enum itemsViewState {
  artists = 'artists',
  tracks = 'tracks',
}
const itemsViews: itemsViewState[] = [
  itemsViewState.tracks,
  itemsViewState.artists,
]
const timeRanges: SpotifyTopRange[] = [
  SpotifyTopRange.shortTerm,
  SpotifyTopRange.mediumTerm,
  SpotifyTopRange.longTerm,
]
const ProfilePage = () => {
  const { authService, spotifyService } = React.useContext(ServiceContext)
  if (!authService.isLoggedIn) {
    typeof window != 'undefined' && navigate('/')
    return null
  }

  const [loading, setLoading] = React.useState(false)
  const [itemViewIndex, setItemViewIndex] = React.useState(0)
  const [timeRangeIndex, setTimeRangeIndex] = React.useState(0)
  const [offset, setOffset] = React.useState(0)

  const timeRangeMessages = [
    '4 weeks',
    '6 months',
    'all time'
  ]
  const currentTimeRange = timeRanges[timeRangeIndex]
  const listMap: {
    [timeRange: string]: any[]
  }[] = [
    spotifyService.topTracksMap,
    spotifyService.topArtistsMap,
  ]
  const currentMap = listMap[itemViewIndex]

  React.useEffect(() => {
    if (loading) {
      return
    }
    // have loaded at least first 10 && current offset for view has loaded
    if (offset > 0 && currentMap[currentTimeRange].length == offset) {
      return
    }
    loadCurrentDisplay()
  }, [offset, timeRangeIndex, itemViewIndex])
  
  const loadCurrentDisplay = async () => {
    switch (itemsViews[itemViewIndex]) {
      case itemsViewState.artists:
        await loadArtists()
        break
      case itemsViewState.tracks:
        await loadTracks()
        break
    }
  }

  const scrollToLastItem = () => {
    // could use refs to make it more react-like but I'm OK with this for now
    const allListItems = document.querySelectorAll('li')
    const lastItem = allListItems[allListItems.length - 1]
    if (!lastItem) {
      return
    }
    lastItem.scrollIntoView({
      behavior: 'smooth',
    })
  }
  const loadArtists = async () => {
    setLoading(true)
    await spotifyService.getTopItems(SpotifyItemType.artists, currentTimeRange, offset)
    setLoading(false)
    scrollToLastItem()
  }
  const loadTracks = async () => {
    setLoading(true)
    await spotifyService.getTopItems(SpotifyItemType.tracks, currentTimeRange, offset)
    setLoading(false)
    scrollToLastItem()
  }
  const loadAudioFeatures = async () => {
    if (spotifyService.audioFeaturesMap[currentTimeRange]) {
      return
    }
    setLoading(true)
    await spotifyService.getAudioFeatures(currentTimeRange)
    setLoading(false)
    scrollToLastItem()
  }

  const loadMore = () => {
    const nextOffset = offset + CHUNK_SIZE
    setOffset(nextOffset)
  }

  const swipeListener = new SwipeListener(['left', 'right'], (direction: ISwipeDirection) => {
    if (loading) {
      return
    }
    let nextTimeRange = timeRangeIndex
    if (direction == 'right') {
      nextTimeRange--
    }
    if (direction == 'left') {
      nextTimeRange++
    }
    if (nextTimeRange > timeRanges.length - 1) {
      return
    }
    if (nextTimeRange < 0) {
      return
    }

    if (nextTimeRange != timeRangeIndex) {
      updateTimeRange(nextTimeRange)
    }
  })

  // check next type range for current timerange
  const updateItemView = (idx: number) => {
    const nextOffset = listMap[idx][currentTimeRange].length
    if (nextOffset != offset) {
      setOffset(nextOffset)
    }
    setItemViewIndex(idx)
  }
  // check next time range for current type
  const updateTimeRange = (idx: number) => {
    const nextRange = timeRanges[idx]
    const nextOffset = currentMap[nextRange].length
    if (nextOffset != offset) {
      setOffset(nextOffset)
    }
    setTimeRangeIndex(idx)
  }

  return (
    <>
      <Header />
      <main>
        <section className="profileHeader">
          <ProfilePicture src={authService.loggedInUser?.displayPicture} name={authService.loggedInUser?.displayName}
            size={ProfilePicSize.full} hCenter={true} />
        </section>
        <section className="profileControls">
          <div className="itemTypes">
            {itemsViews.map((v, i) => (
              <span key={i} className={'option' + (i == itemViewIndex ? ' selected' : '')}
                onClick={() => updateItemView(i)}>{v}</span>
            ))}
          </div>
          <div className="timeRanges">
            {timeRanges.map((t, i) => (
              <span key={i} className={'option' + (i == timeRangeIndex ? ' selected' : '')}
                onClick={() => updateTimeRange(i)}>{timeRangeMessages[i]}</span>
            ))}
          </div>
        </section>
        <section className="profileDataView carousel"
          onTouchStart={e => swipeListener.onTouchStart(e.nativeEvent)}
          onTouchMove={e => swipeListener.onTouchMove(e.nativeEvent)}
          onTouchEnd={() => swipeListener.onTouchEnd()}>
          <ul className="carousel-item active">
            { itemsViews[itemViewIndex] == itemsViewState.artists &&
              spotifyService.topArtistsMap[currentTimeRange]?.map((a: ISpotifyArtist, i: number) => (
                <TopItem key={i} title={a.name} imageUrl={a.images[0].url} popularity={a.popularity}/>
            ))}
            { itemsViews[itemViewIndex] == itemsViewState.tracks &&
              spotifyService.topTracksMap[currentTimeRange].map((t: ISpotifyTrack, i: number) => (
                <TopItem key={i} title={t.name} subTitle={t.artists[0].name} imageUrl={t.album.images[0].url} popularity={t.popularity} />
            ))}
            { loading && Array(CHUNK_SIZE).fill(0).map((_, idx: number) => (
                <li key={idx} className="topItem placeholder"></li>
            ))}
          </ul>
          {/* must hide loadMore for AudioFeatures */}
          { !loading && <p className="loadMore" onClick={loadMore}>load more</p>}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
