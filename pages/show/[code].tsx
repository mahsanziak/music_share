import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabase'
import Waveform from '../../components/Waveform'

interface Show {
  name: string
  description: string
}

const ShowPage = () => {
  const router = useRouter()
  const { code } = router.query
  const [show, setShow] = useState<Show | null>(null)
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false)
  const [clickHereVisible, setClickHereVisible] = useState<boolean>(true)

  useEffect(() => {
    if (code) {
      fetchShow()
    }
  }, [code])

  const fetchShow = async () => {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .eq('code', code)
      .single()
    if (data) {
      setShow(data)
    } else {
      console.error(error)
    }
  }

  const handlePlayAudio = () => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement | null
    if (audio) {
      audio.play().then(() => {
        setAudioPlaying(true)
      }).catch((error) => {
        console.error('Error playing audio:', error)
      })
    }
  }

  useEffect(() => {
    if (!audioPlaying) {
      const audio = document.getElementById('background-audio') as HTMLAudioElement | null
      if (audio) {
        audio.play().then(() => {
          setAudioPlaying(true)
        }).catch(() => {
          // Autoplay blocked, wait for user interaction
        })
      }
    }
  }, [audioPlaying])

  const handleClickAnywhere = () => {
    if (!audioPlaying) {
      handlePlayAudio()
    }
    setClickHereVisible(false)
  }

  if (!show) return <div>Loading...</div>

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen animate-gradient-shift text-white space-y-8 px-4" onClick={handleClickAnywhere}>
      <Waveform />
      <audio id="background-audio" src="/background-music.mp3" loop />
      {clickHereVisible && (
        <div className="absolute top-8 flex flex-col items-center space-y-4 text-center">
          <div className="tap-animation">👆</div>
          <div className="click-text">Click anywhere on the screen for some music 🎵</div>
        </div>
      )}
      <h1 className="relative z-10 text-4xl md:text-5xl font-thin mb-8 text-center">
        Welcome to {show.name}!
      </h1>
      <p className="relative z-10 mt-4 text-center">{show.description}</p>
      <button
        onClick={() => router.push(`/request/${code}`)}
        className="relative z-10 mt-4 p-4 bg-transparent text-white border border-darkGray rounded-lg hover:bg-darkGray hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-darkGray focus:ring-opacity-50 transition duration-300"
      >
        Request a Song
      </button>
    </div>
  )
}

export default ShowPage
