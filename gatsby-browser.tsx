import React from "react";
import HttpClient from "./src/clients/httpClient";
import { IServiceContext } from "./src/models/context";
import AdminService from "./src/services/adminService";
import AuthService from "./src/services/authService";
import QuizService from "./src/services/quizService";
import SpotifyService from "./src/services/spotifyService";

const httpClient = new HttpClient();
const services: IServiceContext = {
  authService: new AuthService(httpClient),
  quizService: new QuizService(httpClient),
  spotifyService: new SpotifyService(httpClient),
  adminService: new AdminService(httpClient),
};
export const ServiceContext = React.createContext(services);

export const wrapRootElement = ({ element }: any) => {
  return (
    <ServiceContext.Provider value={services}>
      {element}
    </ServiceContext.Provider>
  );
};
