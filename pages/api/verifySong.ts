import type { NextApiRequest, NextApiResponse } from 'next';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const getSpotifyToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  return data.access_token;
};

const verifySong = async (artist: string, song: string) => {
  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=track:${song} artist:${artist}&type=track`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log('Spotify search result:', data); // Log Spotify search result
  return data.tracks.items.length > 0;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { artist, song } = req.body;
    if (!artist || !song) {
      res.status(400).json({ success: false, message: 'Artist and song are required' });
      return;
    }

    const isVerified = await verifySong(artist, song);
    if (isVerified) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Song not found' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
