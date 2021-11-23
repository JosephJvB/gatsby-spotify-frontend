import httpClient from "../clients/httpClient"

const SpotifyStart = () => {
  return (
    <div>
      <p>Keen to join? <a href={httpClient.startUrl} target="_blank">Start here.</a> All good if not!!</p>
    </div>
  )
}

export default SpotifyStart