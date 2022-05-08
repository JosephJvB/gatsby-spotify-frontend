import AuthService from "../services/authService";
import QuizService from "../services/quizService";
import SpotifyService from "../services/spotifyService";

export interface IServiceContext {
  authService: AuthService,
  quizService: QuizService,
  spotifyService: SpotifyService
}