import * as React from 'react'
import authService from '../services/authService'

export enum ProfilePicSize {
  thumbnail = "thumbnail",
  full = "full",
}
export interface IProfilePictureProps {
  size?: ProfilePicSize
  vCenter?: boolean
  hCenter?: boolean
}

const emptyColourPairs = [
  { color: 'cornflowerblue', backgroundColor: 'aquamarine' },
]

const ProfilePicture = (props: IProfilePictureProps) => {
  const r = Math.floor(Math.random() * emptyColourPairs.length)
  const { color, backgroundColor } = emptyColourPairs[r]
  const border = props.size == ProfilePicSize.full && 'solid 2.5px rgba(240, 240, 240, 1)'
  let margin = ''
  if (props.vCenter || props.hCenter) {
    margin = [
      props.vCenter ? 'auto' : '0',
      props.hCenter ? 'auto' : '0',
    ].join(' ')
  }
  const pfpStyle = {
    border,
    margin,
  }
  const emptyStyle = {
    color,
    backgroundColor,
    border,
    margin,
  }
  const imgClass = 'profileImg ' + (props.size == ProfilePicSize.full ? 'imgFull' : 'imgThumb')
  return (
    <>
      { authService.loggedInUser && authService.loggedInUser.displayPicture &&
        <img height="375" width="375"
          style={pfpStyle}
          className={imgClass}
          src={authService.loggedInUser.displayPicture}
          alt="user spotify profile picture" />
      }
      { authService.loggedInUser && !authService.loggedInUser.displayPicture &&
        <div className={imgClass + " emptyProfileImg"} style={emptyStyle}>
          <p>{authService.loggedInUser?.displayName.substr(0, 1)}</p>
        </div>
      }
    </>
  )
}

export default ProfilePicture