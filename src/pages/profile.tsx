import { navigate } from "gatsby-link"
import { ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import * as React from "react"
import { ServiceContext } from "../../gatsby-browser"
import AudioFeatures from '../components/audioFeatures'
import Footer from "../components/footer"

import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import TopItem from "../components/topItem"

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
  const [showAudioFeatures, setShowAudioFeatures] = React.useState(false)
  const [trackIndex, setTrackIndex] = React.useState(0)

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
  const currentView = itemsViews[itemViewIndex]

  React.useEffect(() => {
    if (loading) {
      return
    }
    // have loaded at least first 10 && current offset for view has loaded
    if (currentMap[currentTimeRange].length >= CHUNK_SIZE && currentMap[currentTimeRange].length == offset) {
      return
    }
    loadCurrentDisplay()
  }, [offset, timeRangeIndex, itemViewIndex])
  
  const loadCurrentDisplay = async () => {
    switch (currentView) {
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
    const featuresLoaded = spotifyService.audioFeaturesMap[currentTimeRange]
    const tracksLoaded = spotifyService.topTracksMap[currentTimeRange]
    if (featuresLoaded.length == tracksLoaded.length) {
      return
    }
    setLoading(true)
    await spotifyService.getAudioFeatures(currentTimeRange)
    setLoading(false)
    scrollToLastItem()
  }

  const loadMore = () => {
    if (loading) {
      return
    }
    const nextOffset = offset + CHUNK_SIZE
    setOffset(nextOffset)
  }

  // check next type range for current timerange
  const updateItemView = (idx: number) => {
    if (loading) {
      return
    }
    if (showAudioFeatures) {
      setShowAudioFeatures(false)
    }
    const nextOffset = listMap[idx][currentTimeRange].length
    if (nextOffset != offset) {
      setOffset(nextOffset)
    }
    setItemViewIndex(idx)
  }
  // check next time range for current type
  const updateTimeRange = (idx: number) => {
    if (loading) {
      return
    }
    if (showAudioFeatures) {
      setShowAudioFeatures(false)
    }
    const nextRange = timeRanges[idx]
    const nextOffset = currentMap[nextRange].length
    if (nextOffset != offset) {
      setOffset(nextOffset)
    }
    setTimeRangeIndex(idx)
  }

  const clickTrack = async (index: number) => {
    setTrackIndex(index)
    setShowAudioFeatures(true)
    await loadAudioFeatures()
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
        <section className="profileDataView">
          { currentView == itemsViewState.tracks && showAudioFeatures &&
            <AudioFeatures
              timeRange={currentTimeRange}
              trackIndex={trackIndex}
              setShowAudioFeatures={setShowAudioFeatures}
              loading={loading} />
          }
          { !showAudioFeatures && <ul className="dataList">
            { currentView == itemsViewState.artists &&
              spotifyService.topArtistsMap[currentTimeRange]?.map((a: ISpotifyArtist, i: number) => (
                <TopItem clickHandler={() => null} key={i} title={a.name} imageUrl={a.images[0].url} popularity={a.popularity}/>
            ))}
            { currentView == itemsViewState.tracks && !showAudioFeatures &&
              spotifyService.topTracksMap[currentTimeRange].map((t: ISpotifyTrack, i: number) => (
                <TopItem clickHandler={() => clickTrack(i)} key={i} title={t.name} subTitle={t.artists[0].name} imageUrl={t.album.images[0].url} popularity={t.popularity} />
            ))}
            { loading && !showAudioFeatures && Array(CHUNK_SIZE).fill(0).map((_, idx: number) => (
                <li key={idx} className="topItem placeholder"></li>
            ))}
          </ul>}
          { !loading && !showAudioFeatures && <p className="loadMore" onClick={loadMore}>load more</p> }
          {/* must hide loadMore for AudioFeatures */}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
