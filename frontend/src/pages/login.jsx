// Auth page
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In to Your Account</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">New here? <span className="text-indigo-600 underline cursor-pointer">Create account</span></p>
      </div>
    </div>
  );
}
