import { useRouter } from 'next/router'

const ThankYouPage = () => {
  const router = useRouter()
  const { code } = router.query

  return (
    <div className="container">
      <h1 className="text-4xl font-bold">Thank you for your request!</h1>
      <p className="mt-4">Your request has been recorded and will be whispered into the performers ear.</p>
      <button onClick={() => router.push(`/request/${code}`)} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Request Another Song
      </button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          background-color: #1a1a1a;
          color: white;
        }
      `}</style>
    </div>
  )
}

export default ThankYouPage
