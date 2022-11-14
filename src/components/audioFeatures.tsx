import { SpotifyTopRange } from 'jvb-spotty-models'
import React from 'react'
import { ServiceContext } from '../../gatsby-browser'



export interface IAudioFeatureProps {
  timeRange: SpotifyTopRange
  loading: boolean
}

export interface DisplayFeatures {
  acousticness: 0,
  danceability: 0,
  energy: 0,
  instrumentalness: 0,
  // key: 0,
  // liveness: 0,
  // mode: 0,
  // speechiness: 0,
  // tempo: 0,
  // time_signature: 0,
  valence: 0,
}
export interface IFeatureAverage {
  featureName: string
  label: string
  min: number
  max: number
  value: number
  percentage: string
  width: string
  valueDisplay: string
  color: string
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

const AudioFeatures = (props: IAudioFeatureProps) => {
  const { spotifyService } = React.useContext(ServiceContext)

  const red = '#eb1e32'
  const yellow = '#fbe719'
  const green = '#1db954'

  const avgs: DisplayFeatures = {
    acousticness: 0,
    danceability: 0,
    energy: 0,
    instrumentalness: 0,
    // key: 0,
    // liveness: 0,
    // mode: 0,
    // speechiness: 0,
    // tempo: 0,
    // time_signature: 0,
    valence: 0,
  }
  for (const trackFeature of spotifyService.audioFeaturesMap[props.timeRange]) {
    for (const key in avgs) {
      (avgs as any)[key] += (trackFeature as any)[key]
    }
  }
  const displayKeys = Object.keys(avgs)
  const averages: IFeatureAverage[] = displayKeys.map(key => {
    const value: number = (avgs as any)[key] / spotifyService.audioFeaturesMap[props.timeRange].length
    const min = key == 'tempo' ? 50 : 0
    const max = key == 'tempo' ? 250 : 1
    const percent = (value / max * 100)
    let color = red
    if (percent > 40) {
      color = yellow
    }
    if (percent > 70) {
      color = green
    }
    return {
      featureName: key,
      label: featureLabelMap[key] || key,
      min,
      max,
      percentage: percent.toFixed(2),
      width: percent.toFixed(0) + '%',
      value,
      valueDisplay: value.toFixed(2),
      color,
    }
  })

  return (
    <>
      { !props.loading && averages.map((a: IFeatureAverage, i: number) => (
        <li className="audioFeature" key={i}>
          <div className="title">
            <span className="label">{a.label}</span>
          </div>
          <div className="progressBar">
            <span className="progress" style={{ width: a.width, background: a.color }}></span>
          </div>
        </li>
      ))}
      { props.loading && averages.map((_, idx: number) => (
        <li key={idx} className="audioFeature placeholder"></li>
      ))}
    </>
  )
}

export default AudioFeatures