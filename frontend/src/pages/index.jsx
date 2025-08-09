import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center p-4">
      <h1 className="text-5xl font-bold mb-6">AI Resume & Cover Letter Builder</h1>
      <p className="text-xl mb-8 max-w-xl">
        Upload your resume, get optimized cover letters, emails, and suggestions powered by AI. 3 free scans available!
      </p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          Get Started
        </Link>
        <Link to="/upload" className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition">
          Upload Resume
        </Link>
      </div>
    </div>
  );
}
