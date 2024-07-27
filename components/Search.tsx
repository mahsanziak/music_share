import { useState, useEffect } from 'react'

const Search = ({ onSelect }: { onSelect: (platform: string, song: any) => void }) => {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<any[]>([])
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300ms debounce time

    return () => {
      clearTimeout(handler)
    }
  }, [query])

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery) {
        const spotifyResults = await fetch(`/api/searchSpotify?query=${debouncedQuery}`).then(res => res.json())
        setResults(spotifyResults.map((song: any) => ({ platform: 'Spotify', ...song })))
      }
    }

    handleSearch()
  }, [debouncedQuery])

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <ul className="mt-4 space-y-2 bg-white p-2 rounded shadow">
        {results.map((result, index) => (
          <li key={index} className="flex justify-between p-2 border-b">
            <span>{result.name} ({result.artist})</span>
            <button onClick={() => onSelect(result.platform, result)} className="ml-4 p-2 bg-green-500 text-white rounded">
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Search
