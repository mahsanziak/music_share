import type { NextApiRequest, NextApiResponse } from 'next';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

let cache: { [key: string]: any } = {};

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

const searchSpotify = async (query: string) => {
  if (cache[query]) {
    return cache[query];
  }

  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
    return [];
  }

  const data = await response.json();
  const results = data.tracks.items.map((track: any) => ({
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    thumbnail: track.album.images[0]?.url,
    url: track.external_urls.spotify,
  }));

  cache[query] = results;
  return results;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  const results = await searchSpotify(query as string);
  res.status(200).json(results);
}
