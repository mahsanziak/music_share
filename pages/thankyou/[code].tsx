import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Waveform from '../../components/Waveform';

const ThankYouPage = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    console.log(`Thank You page loaded with code: ${code}`);
  }, [code]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen animate-gradient-shift text-white space-y-8 px-4 text-center">
      <Waveform />
      <audio id="background-audio" src="/Daddy_cool.mp3" loop autoPlay />
      <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-thin mb-8 typing-animation text-center">
        Thank you for your request!
      </h1>
      <div className="relative z-10 centered-box">
        <p className="text-black mb-4">Your request has been recorded and will be whispered into the performer&apos;s ear.</p>
        <button onClick={() => router.push(`/show/${code}`)} className="mt-4 p-4 bg-transparent text-white border border-darkGray rounded-lg hover:bg-darkGray hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-darkGray focus:ring-opacity-50 transition duration-300">
          Request Another Song
        </button>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw; /* Ensure the background covers the full width of the viewport */
          margin: 0; /* Remove default margins */
          text-align: center;
          background: linear-gradient(270deg, #4A90E2, #D0021B, #F5A623, #50E3C2);
          background-size: 600% 600%;
          animation: gradient-shift 15s linear infinite;
          color: white;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .centered-box {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          padding: 2rem 4rem; /* Added more padding for better visibility */
          border-radius: 1rem;
          box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1);
          max-width: 28rem; /* Updated max-width for wider text box */
          width: 100%;
          margin: 0 auto; /* Center the box horizontally */
          text-align: center; /* Center the text within the box */
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;
