import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import supabase from '../../lib/supabase';
import Waveform from '../../components/Waveform';
import Search from '../../components/Search';

interface Show {
  name: string;
  description: string;
}

const ShowRequestPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [show, setShow] = useState<Show | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [clickHereVisible, setClickHereVisible] = useState<boolean>(true);
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (code) {
      fetchShow();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSelectedSongs([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    }
  };

  const handlePlayAudio = () => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement | null;
    if (audio) {
      audio.play().then(() => {
        setAudioPlaying(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };

  useEffect(() => {
    if (!audioPlaying) {
      const audio = document.getElementById('background-audio') as HTMLAudioElement | null;
      if (audio) {
        audio.play().then(() => {
          setAudioPlaying(true);
        }).catch(() => {
          // Autoplay blocked, wait for user interaction
        });
      }
    }
  }, [audioPlaying]);

  const handleClickAnywhere = () => {
    if (!audioPlaying) {
      handlePlayAudio();
    }
    setClickHereVisible(false);
  };

  const handleSelectSong = (platform: string, song: any) => {
    setSelectedSongs([{ platform, ...song }]);
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = `${song.name} (${song.artist})`;
    }
  };

  const handleRequestSong = () => {
    console.log(`Navigating to thank you page with code: ${code}`);
    router.push(`/thankyou/${code}`);
  };

  if (!show) return <div>Loading...</div>;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen animate-gradient-shift text-white space-y-8 px-4 text-center" onClick={handleClickAnywhere}>
      <Waveform />
      <audio id="background-audio" src="/Daddy_cool.mp3" loop />
      {clickHereVisible && (
        <div className="absolute top-8 flex flex-col items-center space-y-4 text-center">
          <div className="tap-animation">👆</div>
          <div className="click-text">Click anywhere on the screen for some music 🎵</div>
        </div>
      )}
      <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-thin mb-8 typing-animation text-center">
        Welcome to {show.name}!
      </h1>
      <div className="relative z-10 centered-box">
        <div ref={searchRef}>
          <Search onSelect={handleSelectSong} />
        </div>
        <button onClick={handleRequestSong} className="mt-4 p-4 bg-transparent text-white border border-darkGray rounded-lg hover:bg-darkGray hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-darkGray focus:ring-opacity-50 transition duration-300">
          Request Song
        </button>
        <ul className="mt-8 space-y-4 w-full max-w-md text-black">
          {selectedSongs.map((song, index) => (
            <li key={index} className="flex justify-between items-center p-4 border rounded bg-white">
              {song.thumbnail && <img src={song.thumbnail} alt={`Thumbnail for ${song.name}`} className="w-12 h-12 rounded mr-4" />}
              <span>{song.name} ({song.platform})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShowRequestPage;
