import * as React from 'react'

export interface TopItemProps {
  title: string
  subTitle?: string
  imageUrl: string
  popularity: number
}

const TopItem = (props: TopItemProps) => {
  const green = '#1db954'
  const orange = '#f59b23'
  const red = '#eb1e32'
  let colour = red
  if (props.popularity >= 70) {
    colour = green
  } else if (props.popularity >= 50) {
    colour = orange
  }
  const style = {
    // color: colour,
    border: `solid 1px ${colour}`,
  }
  return (
    <li className="topItem">
      <img style={{height: '40px', width: 'auto', marginRight: '10px'}} width="640" height="640" src={props.imageUrl} alt={`image for ${props.title}`} />
      <div className="itemText">
        <div className="itemTitles">
          <p>{props.title}</p>
          { props.subTitle && <p style={{marginLeft: '10px'}}>{props.subTitle}</p> }
        </div>
        <p className="popularity" style={style}>{props.popularity}</p>
      </div>
    </li>
  )
}

export default TopItem