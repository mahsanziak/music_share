import { useEffect, useRef, useState } from 'react';

const useAudioVisualizer = (audioElementId: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = document.getElementById(audioElementId) as HTMLAudioElement;
      if (audioRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioRef.current);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 1024;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        audioContextRef.current = audioContext;

        const update = () => {
          if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            setFrequencyData(new Uint8Array(dataArrayRef.current));
          }
          requestAnimationFrame(update);
        };

        update();
      }
    }
  }, [audioElementId]);

  const resumeAudioContext = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  return { frequencyData, resumeAudioContext };
};

export default useAudioVisualizer;
