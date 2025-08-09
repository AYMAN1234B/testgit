// Upload and generate page
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    alert(`Uploading: ${file.name}`);
    // implement backend logic here
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Your Resume</h1>
      <p className="text-gray-600 mb-6">Supported formats: PDF, DOCX, TXT</p>
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="mb-4" />
      <button
        disabled={!file}
        onClick={handleUpload}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
      >
        Upload & Scan
      </button>
    </div>
  );
}
