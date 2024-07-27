import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Waveform from '../components/Waveform'

const Home = () => {
  const [code, setCode] = useState<string>('')
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false)
  const [clickHereVisible, setClickHereVisible] = useState<boolean>(true)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/show/${code}`)
  }

  const handlePlayAudio = () => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement
    audio.play().then(() => {
      setAudioPlaying(true)
    }).catch((error) => {
      console.error('Error playing audio:', error)
    })
  }

  useEffect(() => {
    if (!audioPlaying) {
      const audio = document.getElementById('background-audio') as HTMLAudioElement
      audio.play().then(() => {
        setAudioPlaying(true)
      }).catch(() => {
        // Autoplay blocked, wait for user interaction
      })
    }
  }, [audioPlaying])

  const handleClickAnywhere = () => {
    if (!audioPlaying) {
      handlePlayAudio()
    }
    setClickHereVisible(false)
  }

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
      <h1 className="relative z-10 text-4xl md:text-5xl font-thin mb-8 typing-animation text-center">
        Welcome to Music Share!
      </h1>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-xl shadow-2xl space-y-6 max-w-sm w-full">
        <input
          type="text"
          placeholder="Please type in your show code!"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full p-4 border border-darkGray rounded-lg focus:outline-none focus:ring-0 focus:border-darkGray text-black bg-white bg-opacity-50 placeholder-gray-600 placeholder-italic"
        />
        <button
          type="submit"
          className="w-full p-4 bg-transparent text-white border border-darkGray rounded-lg hover:bg-darkGray hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-darkGray focus:ring-opacity-50 transition duration-300"
        >
          Let&apos;s Go!
        </button>
      </form>
    </div>
  )
}

export default Home
