import type { NextApiRequest, NextApiResponse } from 'next';
import spotify from '../../../../lib/spotify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success?: boolean; error?: boolean }>
) {
  if (req.method === 'GET') {
    const { action } = req.query;
    
    if (!action || typeof action !== 'string') {
      return res.status(400).json({ error: true });
    }
    
    try {
      // For a real implementation, use the Spotify API
      if (process.env.SPOTIFY_REFRESH_TOKEN) {
        // First refresh access token
        const tokenResponse = await spotify.refreshAccessToken();
        spotify.setAccessToken(tokenResponse.body.access_token);
        
        // Then control playback
        switch (action) {
          case 'play':
            await spotify.play();
            break;
          case 'pause':
            await spotify.pause();
            break;
          case 'next':
            await spotify.skipToNext();
            break;
          case 'previous':
            await spotify.skipToPrevious();
            break;
          default:
            return res.status(400).json({ error: true });
        }
        
        return res.status(200).json({ success: true });
      }
      
      // For demo without Spotify API
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(`Spotify control error (${action}):`, error);
      return res.status(500).json({ error: true });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}