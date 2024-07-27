import useAudioVisualizer from '../hooks/useAudioVisualizer';

const Waveform = () => {
  const { frequencyData, resumeAudioContext } = useAudioVisualizer('background-audio');

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 opacity-75" onClick={resumeAudioContext}>
      <div className="flex items-center justify-center space-x-1 w-full">
        {Array.from({ length: 100 }).map((_, index) => (
          <div
            key={index}
            className="w-1.5 rounded-full waveform-bar"
            style={{
              height: frequencyData ? `${frequencyData[index % frequencyData.length] * 2}px` : '50px', // Increased scaling factor for more sensitivity
              minHeight: '20px', // Ensure a minimum height for visibility
              backgroundColor: 'black', // Set bars to black
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Waveform;
