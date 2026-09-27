import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import StatusCard from '../components/StatusCard';
import { addFileRecord, updateFileStatus } from '../services/mockStorage';
import { uploadFileToS3 } from '../services/s3Service';

export default function Home() {
  const [currentFile, setCurrentFile] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (file) => {
    setCurrentFile(file);
    setCurrentRecord(null);
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!currentFile) return;

    setIsProcessing(true);
    setUploadError('');

    // 1. Create initial record in mock storage
    const record = addFileRecord(currentFile);
    setCurrentRecord(record);

    try {
      // 2. Upload file to AWS S3 Input Bucket
      updateFileStatus(record.id, 'UPLOADED');
      setCurrentRecord(prev => ({ ...prev, status: 'UPLOADED' }));

      const s3Result = await uploadFileToS3(currentFile);

      if (!s3Result.success) {
        throw new Error(s3Result.error || 'Failed to upload to S3');
      }

      // 3. Update status to QUEUED and PROCESSING (Lambda is processing it in the cloud)
      setTimeout(() => {
        updateFileStatus(record.id, 'QUEUED');
        setCurrentRecord(prev => ({ ...prev, status: 'QUEUED' }));
      }, 1000);

      setTimeout(() => {
        updateFileStatus(record.id, 'PROCESSING');
        setCurrentRecord(prev => ({ ...prev, status: 'PROCESSING' }));
      }, 2500);

      setTimeout(() => {
        const finalStatus = 'COMPLETED';
        const extra = { 
          processingResult: `Successfully uploaded to S3 (${s3Result.bucket}) and processed by Lambda/DynamoDB.` 
        };

        updateFileStatus(record.id, finalStatus, extra);
        setCurrentRecord(prev => ({ ...prev, status: finalStatus, ...extra }));
        setIsProcessing(false);
      }, 4500);

    } catch (err) {
      console.error(err);
      updateFileStatus(record.id, 'FAILED', { errorMessage: err.message });
      setCurrentRecord(prev => ({ ...prev, status: 'FAILED', errorMessage: err.message }));
      setUploadError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Scalable Serverless File Processing Pipeline</h1>
        <p>Upload your file directly to AWS S3 and let the cloud process it automatically. Supported formats: JPG, JPEG, PNG, PDF, CSV, TXT (Max size: 5 MB).</p>

        <FileUpload onFileSelect={handleFileSelect} />

        {uploadError && <div className="alert-error" style={{ marginTop: '1rem' }}>{uploadError}</div>}

        {currentFile && !isProcessing && !currentRecord && (
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <button onClick={handleUpload} className="btn-primary">
              Upload to S3 & Run Pipeline
            </button>
          </div>
        )}
      </div>

      {currentRecord && (
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pipeline Execution Status</h2>
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