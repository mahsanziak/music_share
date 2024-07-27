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
        try {
          const spotifyResults = await fetch(`/api/searchSpotify?query=${debouncedQuery}`).then((res) => res.json());
          console.log(spotifyResults); // Log the results to verify they include thumbnails
          const formattedResults = spotifyResults.slice(0, 5).map((song: any) => ({
            platform: 'Spotify',
            thumbnail: song.thumbnail || '', // Ensure thumbnail is included
            name: song.name,
            artist: song.artist || 'Unknown Artist',
          }));
          setResults(formattedResults);
        } catch (error) {
          console.error('Error fetching Spotify results:', error);
          setResults([]);
        }
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  const handleClickOutside = (event: MouseEvent) => {
    if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <ul ref={resultsRef} className="mt-4 space-y-2 bg-white p-2 rounded shadow max-h-60 overflow-y-auto">
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
