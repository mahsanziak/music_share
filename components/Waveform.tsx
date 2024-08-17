import { useEffect, useState } from 'react';

const Waveform = () => {
  const [frequencyData, setFrequencyData] = useState<number[]>(Array(80).fill(50));

  useEffect(() => {
    const updateWaveform = () => {
      const newFrequencyData = Array.from({ length: 40 }, (_, i) => {
        // Generate a smooth wave pattern using multiple sine waves and subtle randomness
        const bass = 50 + 35 * Math.sin(performance.now() / 1200 + i);
        const mid = 50 + 25 * Math.sin(performance.now() / 800 + i * 1.5);
        const treble = 50 + 15 * Math.sin(performance.now() / 600 + i * 2);

        // Smooth transitions between the frequency bands
        return bass + mid + treble + 10 * Math.random();
      });

      // Create symmetry by mirroring the array
      setFrequencyData([...newFrequencyData, ...newFrequencyData.reverse()]);
    };

    const interval = setInterval(updateWaveform, 100); // Smooth animation with frequent updates

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 opacity-75">
      <div className="flex items-center justify-center space-x-1 w-full">
        {frequencyData.map((value, index) => (
          <div
            key={index}
            className="w-2 rounded-full waveform-bar"
            style={{
              height: `${value * 1.5}px`, // Controlled scaling to keep bars visually appealing
              minHeight: '20px', // Maintain minimum height for bars
              background: 'linear-gradient(180deg, #FF7E5F, #FEB47B)', // Gradient for better visual appeal
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Waveform;
