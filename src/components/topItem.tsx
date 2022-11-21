import * as React from 'react'
import { GREEN_COLOUR, ORANGE_COLOUR, RED_COLOUR } from '../config'

export interface TopItemProps {
  title: string
  subTitle?: string
  imageUrl: string
  popularity: number
  clickHandler: () => void
}

const TopItem = (props: TopItemProps) => {
  let colour = RED_COLOUR
  if (props.popularity >= 70) {
    colour = GREEN_COLOUR
  } else if (props.popularity >= 50) {
    colour = ORANGE_COLOUR
  }
  const style = {
    // color: colour,
    border: `solid 1px ${colour}`,
  }
  return (
    <li className="topItem" onClick={props.clickHandler}>
      <img style={{height: '40px', width: 'auto', marginRight: '10px'}} width="640" height="640" src={props.imageUrl} alt={`image for ${props.title}`} />
      <div className="itemText">
        <div className="itemTitles">
          <p>{props.title}</p>
          { props.subTitle && <p style={{marginLeft: '10px'}}>{props.subTitle}</p> }
        </div>
      </div>
    </li>
  )
}

export default TopItem