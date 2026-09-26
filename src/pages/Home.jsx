import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import StatusCard from '../components/StatusCard';
import { addFileRecord, updateFileStatus } from '../services/mockStorage';

export default function Home() {
  const [currentFile, setCurrentFile] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file) => {
    setCurrentFile(file);
    setCurrentRecord(null);
  };

  const handleUpload = () => {
    if (!currentFile) return;

    setIsProcessing(true);
    
    // 1. Create initial record in mock storage
    const record = addFileRecord(currentFile);
    setCurrentRecord(record);

    // Simulate lifecycle sequence locally: UPLOADED -> QUEUED -> PROCESSING -> COMPLETED
    setTimeout(() => {
      updateFileStatus(record.id, 'QUEUED');
      setCurrentRecord(prev => ({ ...prev, status: 'QUEUED' }));
    }, 1500);

    setTimeout(() => {
      updateFileStatus(record.id, 'PROCESSING');
      setCurrentRecord(prev => ({ ...prev, status: 'PROCESSING' }));
    }, 3000);

    setTimeout(() => {
      // Randomly simulate success vs rare failure for testing (90% success)
      const isFailure = Math.random() < 0.1;
      const finalStatus = isFailure ? 'FAILED' : 'COMPLETED';
      const extra = isFailure 
        ? { errorMessage: 'Error: Failed to parse file structure during serverless execution.' }
        : { processingResult: 'Successfully processed and stored in output bucket.' };

      updateFileStatus(record.id, finalStatus, extra);
      setCurrentRecord(prev => ({ ...prev, status: finalStatus, ...extra }));
      setIsProcessing(false);
    }, 5500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-8">
      <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scalable Serverless File Processing Pipeline
        </h1>
        <p className="text-gray-600 mb-6">
          Upload your file and let the cloud process it automatically. Supported formats: JPG, JPEG, PNG, PDF, CSV, TXT (Max size: 5 MB).
        </p>

        <FileUpload onFileSelect={handleFileSelect} />

        {currentFile && !isProcessing && !currentRecord && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              Start Upload & Pipeline
            </button>
          </div>
        )}
      </div>

      {currentRecord && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pipeline Execution Status</h2>
          <StatusCard 
            status={currentRecord.status} 
            filename={currentRecord.filename} 
            errorMessage={currentRecord.errorMessage}
          />
        </div>
      )}
    </div>
  );
}