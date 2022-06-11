export interface IUser {
  spotifyId: string
  displayName: string
  displayPicture?: string
}

export interface ISelectUser extends IUser {
  selected: boolean
}