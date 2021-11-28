import * as React from 'react'

export interface TopItemProps {
  title: string
  subTitle?: string
  imageUrl: string
}

const TopItem = (props: TopItemProps) => {
  return (
    <li className="topItem">
      <img style={{height: '40px', width: 'auto', marginRight: '10px'}} width="640" height="640" src={props.imageUrl} alt={`image for ${props.title}`} />
      <span className="itemText">
        <p>{props.title}</p>
        { props.subTitle && <p style={{marginLeft: '10px'}}>{props.subTitle}</p> }
      </span>
    </li>
  )
}

export default TopItem