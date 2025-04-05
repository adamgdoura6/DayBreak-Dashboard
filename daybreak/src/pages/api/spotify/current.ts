import type { NextApiRequest, NextApiResponse } from 'next';
import spotify from '../../../lib/spotify';
import { SpotifyResponse } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyResponse>
) {
  if (req.method === 'GET') {
    try {
      // For a real implementation, use the Spotify API
      if (process.env.SPOTIFY_REFRESH_TOKEN) {
        // First refresh access token
        const tokenResponse = await spotify.refreshAccessToken();
        spotify.setAccessToken(tokenResponse.body.access_token);
        
        // Then get current track
        const response = await spotify.getMyCurrentPlayingTrack();
        
        if (response.statusCode === 200 && response.body && response.body.is_playing) {
          const { item } = response.body;
          return res.status(200).json({
            is_playing: response.body.is_playing,
            track_name: item.name,
            artist: item.artists[0].name,
            album_art: item.album.images[0]?.url,
            progress_ms: response.body.progress_ms,
            duration_ms: item.duration_ms
          });
        }
      }
      
      // If not playing or no Spotify token, return mock data
      return res.status(200).json({
        is_playing: true,
        track_name: 'Blinding Lights',
        artist: 'The Weeknd',
        album_art: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        progress_ms: 84000,
        duration_ms: 240000
      });
    } catch (error) {
      console.error('Spotify API error:', error);
      return res.status(500).json({ 
        is_playing: false, 
        error: true 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}