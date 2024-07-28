import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabase';
import Waveform from '../../components/Waveform';
import Search from '../../components/Search';

interface Show {
  id: string; // Ensure this matches the type in your database
  name: string;
  description: string;
}

const ShowRequestPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      fetchShow();
    }
  }, [code]);

  const fetchShow = async () => {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .eq('code', code)
      .single();
    if (data) {
      setShow(data);
    } else {
      console.error(error);
      router.push(`/?invalidCode=${code}`);
    }
  };

  const handleSelectSong = (song: any) => {
    if (selectedSongs.length >= 3) {
      setErrorMessage('You can only select up to 3 songs.');
      return;
    }
    setSelectedSongs((prevSongs) => [...prevSongs, song]);
    setErrorMessage(null); // Clear the error message if a song is successfully added
  };

  const handleConfirmRequest = async () => {
    if (selectedSongs.length > 0 && show) {
      try {
        const requests = selectedSongs.map(song => ({
          artist: song.artist,
          song: song.name,
          show_id: show.id,
        }));

        const { error } = await supabase
          .from('requests')
          .insert(requests);

        if (error) {
          throw error;
        }
        router.push(`/thankyou/${code}`);
      } catch (error) {
        console.error('Error inserting song requests:', error);
      }
    }
  };

  if (!show) return <div>Loading...</div>;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen animate-gradient-shift text-white space-y-8 px-4 text-center">
      <Waveform />
      <audio id="background-audio" src="/Daddy_cool.mp3" loop autoPlay />
      <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-thin mb-8 typing-animation text-center">
        Welcome to {show.name}!
      </h1>
      <div className="relative z-10 centered-box w-full">
        <Search onSelect={handleSelectSong} />
        <ul className="mt-4 space-y-2">
          {selectedSongs.map((song, index) => (
            <li key={index} className="flex justify-between items-center p-2 border-b text-white rounded transparent-background">
              {song.thumbnail && <img src={song.thumbnail} alt={`Thumbnail for ${song.name}`} className="w-12 h-12 rounded mr-4" />}
              <span className="flex-grow">{song.name} ({song.artist})</span>
            </li>
          ))}
        </ul>
        {selectedSongs.length > 0 && (
          <button onClick={handleConfirmRequest} className="mt-4 p-2 bg-green-500 text-white rounded">
            Confirm Requests
          </button>
        )}
        {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ShowRequestPage;
