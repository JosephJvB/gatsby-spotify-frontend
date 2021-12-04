import * as React from 'react'
import { IQuestion, IQuizProfile } from '../models/quiz'
import quizService from '../services/quizService'
import ProfilePicture, { ProfilePicSize } from './profilePicture'

export interface IQuestionProps {
  question: IQuestion
  response: IQuestion
  answer: (q: IQuestion) => void
}
const Question = (props: IQuestionProps) => {
  console.log('question props', props)
  const [playingPreview, setPlayingPreview] = React.useState(false)
  const audioEl = React.useRef<HTMLAudioElement>(null)
  React.useEffect(() => {
    audioEl.current.addEventListener('play', () => {
      setPlayingPreview(true)
    })
    audioEl.current.addEventListener('pause', () => {
      setPlayingPreview(false)
    })
  }, [])
  const togglePlaying = () => {
    if (audioEl.current.paused) {
      audioEl.current.play()
    } else {
      audioEl.current.pause()
    }
  }
  const selectChoice= (c: IQuizProfile) => {
    if (quizService.answered) {
      return
    }
    audioEl.current.pause()
    setPlayingPreview(false)
    const question = {...props.question}
    question.answer = c
    props.answer(question)
  }
  return (
    <div className="question">
      <img className="questionAlbumImg"
        src={props.question.track.albumImageUrl}
        alt={'album image for ' + props.question.track.albumName} />
      <p>{props.question.track.artists[0]}</p>
      <p className="trackName">{props.question.track.name}</p>
      { !playingPreview &&
        <img className="questionPlayBtn" src="/static/play-circle-solid.svg" alt="play button icon"
          onClick={togglePlaying}/>
      }
      { playingPreview &&
        <img className="questionPlayBtn" src="/static/pause-circle-solid.svg" alt="play button icon"
          onClick={togglePlaying}/>
      }
      <audio ref={audioEl} src={props.question.track.previewUrl} autoPlay={false} loop={false} ></audio>
      { props.question.choices.map((c, i) => {
        let choiceClass = 'choice'
        if (quizService.answered) {
          if (c.spotifyId == props.question.answer.spotifyId) {
            choiceClass += ' correct'
          } else if (c.spotifyId == props.response?.answer.spotifyId) {
            choiceClass += ' incorrect'
          }
        }
        return <div key={i} className={choiceClass} onClick={e => selectChoice(c)}>
          <ProfilePicture src={c.spotifyDisplayPicture} name={c.spotifyDisplayName}
            size={ProfilePicSize.thumbnail} vCenter={true} />
          <p className="choiceName">{c.spotifyDisplayName}</p>
        </div>
      })}
    </div>
  )
}

export default Question