import { useState, useEffect, useRef } from 'react';

const Search = ({ onSelect }: { onSelect: (platform: string, song: any) => void }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const resultsRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery) {
        const spotifyResults = await fetch(`/api/searchSpotify?query=${debouncedQuery}`).then((res) => res.json());
        setResults(spotifyResults.map((song: any) => ({ 
          platform: 'Spotify', 
          thumbnail: song.album?.images?.[0]?.url || '', 
          ...song 
        })));
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-full text-black search-input"
      />
      {results.length > 0 && (
        <ul ref={resultsRef} className="mt-4 space-y-2 bg-white p-2 rounded shadow">
          {results.map((result, index) => (
            <li key={index} className="flex justify-between items-center p-2 border-b text-black">
              {result.thumbnail && <img src={result.thumbnail} alt={`Thumbnail for ${result.name}`} className="w-12 h-12 rounded mr-4" />}
              <span className="flex-grow">{result.name} ({result.artist})</span>
              <button onClick={() => { onSelect(result.platform, result); setResults([]); }} className="ml-4 p-2 bg-green-500 text-white rounded">
                Select
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
