import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Waveform from '../components/Waveform';

const Home = () => {
  const [code, setCode] = useState<string>('');
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [invalidCodeMessage, setInvalidCodeMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.invalidCode) {
      setInvalidCodeMessage('Invalid code');
    }
  }, [router.query.invalidCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/show/${code}`);
  };

  useEffect(() => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement;
    if (audio && !audioPlaying) {
      audio.play().then(() => {
        setAudioPlaying(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [audioPlaying]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen animate-gradient-shift text-white space-y-8 px-4 text-center">
      <Waveform />
      <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-thin mb-8 typing-animation text-center">
        Welcome to Playlystify!
      </h1>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-xl shadow-2xl space-y-2 max-w-sm w-full">
        <input
          type="text"
          placeholder="Please type in your show code!"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full p-4 border border-darkGray rounded-lg focus:outline-none focus:ring-0 focus:border-darkGray text-black bg-white bg-opacity-50 placeholder-gray-600 placeholder-italic"
        />
        {invalidCodeMessage && (
          <div className="mt-1 text-red-500 text-left">Invalid code</div>
        )}
        <button
          type="submit"
          className="w-full p-4 bg-transparent text-white border border-darkGray rounded-lg hover:bg-darkGray hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-darkGray focus:ring-opacity-50 transition duration-300"
        >
          Let&apos;s Go!
        </button>
      </form>
    </div>
  );
};

export default Home;
