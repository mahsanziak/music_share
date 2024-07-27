import useAudioVisualizer from '../hooks/useAudioVisualizer';

const Waveform = () => {
  const { frequencyData, resumeAudioContext } = useAudioVisualizer('background-audio');

  return (
    <div className="absolute inset-0 flex items-center justify-center space-x-2 z-0 opacity-75" onClick={resumeAudioContext}>
      {Array.from({ length: 40 }).map((_, index) => (
        <div
          key={index}
          className="w-1.5 rounded-full waveform-bar"
          style={{
            height: frequencyData ? `${frequencyData[index] * 2}px` : '50px', // Increased scaling factor for more sensitivity
            minHeight: '20px', // Ensure a minimum height for visibility
            backgroundColor: 'black', // Set bars to black
          }}
        ></div>
      ))}
    </div>
  );
};

export default Waveform;
