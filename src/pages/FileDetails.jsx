import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoredFiles } from '../services/mockStorage';

export default function FileDetails() {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const files = getStoredFiles();
    const found = files.find(f => f.id === id);
    setFile(found);
  }, [id]);

  if (!file) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">File Not Found</h2>
        <Link to="/history" className="text-blue-600 hover:underline">Back to Processing History</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">File Details</h1>
        <Link to="/history" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
          ← Back to History
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Filename</p>
            <p className="text-lg font-semibold text-gray-800">{file.filename}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">File Type / Format</p>
            <p className="text-lg font-semibold text-gray-800">{file.fileType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Original Size</p>
            <p className="text-base text-gray-800">{file.originalSize}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Processed Size</p>
            <p className="text-base text-gray-800">{file.processedSize}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
              file.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              file.status === 'FAILED' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {file.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Processing Duration</p>
            <p className="text-base text-gray-800">{file.processingDuration || 'N/A'}</p>
          </div>
        </div>

        {file.errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>Error Message: </strong> {file.errorMessage}
          </div>
        )}

        {file.processingResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <strong>Result: </strong> {file.processingResult}
          </div>
        )}

        {file.status === 'COMPLETED' && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => alert('Simulated download of processed result!')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
            >
              Download Processed File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}