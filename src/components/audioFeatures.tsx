import { SpotifyTopRange } from 'jvb-spotty-models'
import React from 'react'
import { ServiceContext } from '../../gatsby-browser'
import SwipeListener, { ISwipeDirection } from '../helpers/swipe'

export interface IAudioFeatureProps {
  timeRange: SpotifyTopRange
  loading: boolean
  trackIndex: number
  setShowAudioFeatures: (state: boolean) => void
}

export const featureLabelMap: {
  [featureName: string]: string
} = {
  valence: 'happiness',
  acousticness: 'acousticness',
  danceability: 'danceability',
  energy: 'energy',
  instrumentalness: 'instrumentalness',
  tempo: 'tempo',
}

export interface IDisplayFeature {
  label: string
  percentage: number
}

const AudioFeatures = (props: IAudioFeatureProps) => {
  const { spotifyService } = React.useContext(ServiceContext)

  const [widthLoaded, setWidthLoaded] = React.useState(false)
  const [idx, setIdx] = React.useState(props.trackIndex)

  console.log('props.index', props.trackIndex)

  React.useEffect(() => {
    if (!props.loading) {
      setWidthLoaded(true)
    }
  }, [props.loading])

  const swipeListener = new SwipeListener(['right', 'up', 'down'], (direction: ISwipeDirection) => {
    if (props.loading) {
      return
    }
    if (direction == 'right') {
      console.log('trying to close')
      props.setShowAudioFeatures(false)
      return
    }
    let nextIdx = idx
    if (direction == 'up') {
      nextIdx++
    }
    if (direction == 'down') {
      nextIdx--
    }
    if (nextIdx != idx && spotifyService.audioFeaturesMap[props.timeRange][nextIdx]) {
      setIdx(nextIdx)
    }
  })

  const trackDetails = spotifyService.topTracksMap[props.timeRange][idx]
  const trackFeatures = spotifyService.audioFeaturesMap[props.timeRange][idx]

  const displayFeatures: IDisplayFeature[] = [
    { label: 'popularity ', percentage: trackDetails.popularity }
  ]
  const featureKeys = [
    // 'acousticness',
    'danceability',
    'energy',
    // 'instrumentalness',
    // 'key',
    // 'liveness',
    // 'mode',
    // 'speechiness',
    // 'tempo',
    // 'time_signature',
    'valence',
  ]
  for (const key of featureKeys) {
    const value = trackFeatures ? (trackFeatures as any)[key] : 0
    displayFeatures.push({
      label: featureLabelMap[key],
      percentage: value * 100
    })
  }

  return (
    <div className="audioFeatureDisplay"
      style={{ display: 'flex', flexDirection: 'column', paddingTop: '15px' }}
      onTouchStart={e => swipeListener.onTouchStart(e.nativeEvent)}
      onTouchMove={e => swipeListener.onTouchMove(e.nativeEvent)}
      onTouchEnd={() => swipeListener.onTouchEnd()}>
      <img style={{
        height: '80px',
        width: 'auto',
        margin: '0 auto'
      }} src={trackDetails.album.images[0].url} alt="track album image" />
      <h3 style={{textAlign: 'center'}}>{trackDetails.name}</h3>
      <ul className="dataList">
        { displayFeatures.map((feat: IDisplayFeature) => (
          <li className="audioFeature" key={feat.label}>
            <div className="title">
              <span className="label">{feat.label}</span>
            </div>
            <div className="progressBar">
              { props.loading && <div className="placeholder"></div>}
              { !props.loading &&
                <span className="progress" style={{
                  width: widthLoaded ? feat.percentage + '%' : '0%',
                }}></span>}
            </div>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default AudioFeatures