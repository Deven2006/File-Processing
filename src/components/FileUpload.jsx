import React, { useState } from 'react';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'txt'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function FileUpload({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size === 0) {
      setError('The selected file is empty.');
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum allowed size is 5 MB.');
      setSelectedFile(null);
      return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError('Unsupported file type. Allowed: JPG, JPEG, PNG, PDF, CSV, TXT.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
    onFileSelect(null);
  };

  return (
    <div>
      <div className="upload-box" onClick={() => document.getElementById('file-input').click()}>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="file-input"
        />
        <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1e293b' }}>
          Click to select a file or drag & drop
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Supports: JPG, PNG, PDF, CSV, TXT (Max 5MB)
        </p>
      </div>

      {selectedFile && (
        <div className="file-info">
          <div>
            <p style={{ fontWeight: '600', color: '#1e3a8a', margin: 0 }}>{selectedFile.name}</p>
            <p style={{ fontSize: '0.8rem', color: '#3b82f6', margin: 0 }}>{(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
          <button onClick={handleRemove} className="btn-remove">Remove</button>
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}
    </div>
  );
}