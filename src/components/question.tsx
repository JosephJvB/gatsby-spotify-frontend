import * as React from 'react'
import { ServiceContext } from '../../gatsby-browser'
import { IQuestion, IQuizProfile } from '../models/quiz'
import ProfilePicture, { ProfilePicSize } from './profilePicture'

export interface IQuestionProps {
  question: IQuestion
  response?: IQuestion
  answer: (q: IQuestion) => void
}
const Question = (props: IQuestionProps) => {
  console.log(props)
  const { quizService } = React.useContext(ServiceContext)
  console.log('question props', props)
  const [playingPreview, setPlayingPreview] = React.useState(false)
  const audioEl = React.useRef<HTMLAudioElement>(null)
  React.useEffect(() => {
    audioEl!.current!.addEventListener('play', () => {
      setPlayingPreview(true)
    })
    audioEl!.current!.addEventListener('pause', () => {
      setPlayingPreview(false)
    })
  }, [])
  const togglePlaying = () => {
    if (audioEl!.current!.paused) {
      audioEl!.current!.play()
    } else {
      audioEl!.current!.pause()
    }
  }
  const selectChoice= (c: IQuizProfile) => {
    if (!!quizService.currentResponse) {
      return
    }
    audioEl!.current!.pause()
    setPlayingPreview(false)
    const question = {...props.question}
    question.answer = c
    props.answer(question)
  }
  const albumImage = props.question.subject.album.images.find(i => !!i.url)
  return (
    <div className="question">
      <div className="questionImgContainer" onClick={togglePlaying}>
        <img className="questionAlbumImg"
          src={albumImage?.url}
          alt={'album image for ' + props.question.subject.album.name} />
        { !playingPreview &&
          <img className="questionPlayBtn" src="/static/play-circle-solid.svg" alt="play button icon" />
        }
        { playingPreview &&
          <img className="questionPlayBtn" src="/static/pause-circle-solid.svg" alt="play button icon" />
        }
      </div>
      <p>{props.question.subject.artists[0].name}</p>
      <p className="trackName">{props.question.subject.name}</p>
      <audio ref={audioEl} src={props.question.subject.preview_url} autoPlay={false} loop={false} ></audio>
      { props.question.choices.map((c, i) => {
        let choiceClass = 'choice'
        if (!!quizService.currentResponse) {
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