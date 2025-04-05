import SpotifyWebApi from 'spotify-web-api-node';

const scopes = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(',');

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params).toString();

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// This would typically be part of an auth flow - for now we'll manually set the token
// You would need to implement proper OAuth2 flow for a production app
if (process.env.SPOTIFY_REFRESH_TOKEN) {
  spotify.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN as string);
}

export default spotify;