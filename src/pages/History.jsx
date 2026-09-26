import React, { useEffect, useState } from 'react';
import { getStoredFiles } from '../services/mockStorage';
import { Link } from 'react-router-dom';

export default function History() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(getStoredFiles());
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 pt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing History</h1>
      <p className="text-gray-600 mb-6">Log of all files submitted to the pipeline.</p>

      {files.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-lg">No files have been processed yet.</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Upload a File
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Filename</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload Time</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.filename}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.fileType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      file.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      file.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.uploadTimestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/file/${file.id}`} className="text-blue-600 hover:text-blue-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}