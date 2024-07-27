import { useState } from 'react'
import Search from '../../components/Search'

const RequestPage = () => {
  const [selectedSongs, setSelectedSongs] = useState<any[]>([])

  const handleSelectSong = (platform: string, song: any) => {
    setSelectedSongs([...selectedSongs, { platform, ...song }])
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Request a Song</h1>
      <Search onSelect={handleSelectSong} />
      <ul className="mt-8 space-y-4 w-full max-w-md">
        {selectedSongs.map((song, index) => (
          <li key={index} className="flex justify-between p-4 border rounded bg-white">
            <span>{song.name} ({song.platform})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RequestPage
