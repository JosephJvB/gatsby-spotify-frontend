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
  percent: number
  colour: string
  percentageDisplay: string
  valueDisplay: string
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

  const [widthLoaded, setWidthLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!props.loading) {
      setWidthLoaded(true)
    }
  }, [props.loading])

  const red = '#eb1e32'
  const yellow = '#fbe719'
  const green = '#1db954'
  const getColour = (percent: number): string => {
    let colour = red
    if (percent > 40) {
      colour = yellow
    }
    if (percent > 70) {
      colour = green
    }
    return colour
  }

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
    return {
      featureName: key,
      label: featureLabelMap[key] || key,
      min,
      max,
      percent,
      percentageDisplay: percent.toFixed(2),
      colour: getColour(percent),
      value,
      valueDisplay: value.toFixed(2),
    }
  })
  return (
    <>
      { averages.map((a: IFeatureAverage, i: number) => (
        <li className="audioFeature" key={i}>
          <div className="title">
            <span className="label">{a.label}</span>
          </div>
          <div className="progressBar">
            { props.loading && <div className="placeholder"></div>}
            { !props.loading &&
              <span className="progress" style={{
                width: widthLoaded ? a.percent + '%' : '0%',
                background: a.colour
              }}></span>}
          </div>
        </li>
      ))}
    </>
  )
}

export default AudioFeatures