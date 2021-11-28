import * as React from 'react'
import authService from '../services/authService'

export enum ProfilePicSize {
  thumbnail = "thumbnail",
  full = "full",
}
interface ISize {
  bg: string
  font: string
}
const sizes: { [key: string]: ISize } = {
  [ProfilePicSize.thumbnail]: { bg: '35px', font: '18px' },
  [ProfilePicSize.full]: { bg: '200px', font: '90px' },
}
export interface IProfilePictureProps {
  size?: ProfilePicSize
  center?: boolean
  spin?: boolean
}

const emptyColourPairs = [
  { color: 'cornflowerblue', backgroundColor: 'aquamarine' },
]

const ProfilePicture = (props: IProfilePictureProps) => {
  const size = sizes[props.size]
  const r = Math.floor(Math.random() * emptyColourPairs.length)
  const { color, backgroundColor } = emptyColourPairs[r]
  const border = props.size == ProfilePicSize.full && 'solid 2.5px rgba(240, 240, 240, 1)'
  const margin = props.center ? '0 auto' : ''
  const pfpStyle = {
    width: size.bg,
    border,
    margin,
  }
  const emptyStyle = {
    height: size.bg,
    width: size.bg,
    color,
    backgroundColor,
    border,
    margin,
  }
  const spottyStyle = {
    height: size.bg,
    width: size.bg,
    margin,
    // border,
  }
  const spinClass = props.spin ? 'imageRotate ' : ''
  return (
    <>
      { !authService.loggedInUser &&
        <img className={`${spinClass}profileImg`} style={spottyStyle} src="/static/spotify.svg" alt="spotify icon logo" />
      }
      { authService.loggedInUser && authService.loggedInUser.displayPicture &&
        <img height="375" width="375"
          style={pfpStyle}
          className={`${spinClass}profileImg`}
          src={authService.loggedInUser.displayPicture}
          alt="user spotify profile picture" />
      }
      { authService.loggedInUser && !authService.loggedInUser.displayPicture &&
        <div className={`${spinClass}profileImg emptyProfileImg`} style={emptyStyle}>
          <p style={{fontSize: size.font}}>{authService.loggedInUser?.displayName.substr(0, 1)}</p>
        </div>
      }
    </>
  )
}

export default ProfilePicture