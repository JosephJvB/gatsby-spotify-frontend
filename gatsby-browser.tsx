import React from "react"
import { IServiceContext } from "./src/models/context"
import AuthService from "./src/services/authService"
import QuizService from "./src/services/quizService"
import SpotifyService from "./src/services/spotifyService"

const services: IServiceContext = {
  authService: new AuthService(),
  quizService: new QuizService(),
  spotifyService: new SpotifyService(),
}
export const ServiceContext = React.createContext(services)

export const wrapRootElement = ({ element }) => {
  return (
    <ServiceContext.Provider value={services}>
      {element}
    </ServiceContext.Provider>
  )
}