import React from "react"
import { IServiceContext } from "./src/models/context"
import AuthService from "./src/services/authService"
import QuizService from "./src/services/quizService"
import SpotifyService from "./src/services/spotifyService"

// this works
// probably I should inject services here?
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