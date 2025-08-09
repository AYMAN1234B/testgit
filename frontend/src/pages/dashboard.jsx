// Dashboard for history, download, etc.
export default function Dashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Resume Summary</h2>
          <p className="text-gray-700">Your resume has been analyzed. AI suggestions are ready.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">AI Cover Letter</h2>
          <p className="text-gray-700">Download or copy your personalized AI-generated cover letter.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Usage</h2>
          <p className="text-gray-700">2 of 3 free scans used. Upgrade for unlimited access.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Referral Code</h2>
          <p className="text-gray-700">Share your referral code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">AI123</span></p>
        </div>
      </div>
    </div>
  );
}
