import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFileRecords, deleteFileRecord } from '../services/mockStorage';

export default function History() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    try {
      const data = getFileRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load records:", e);
      setRecords([]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this file record?")) {
      deleteFileRecord(id);
      loadRecords(); // Refresh state immediately after deletion
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload History & Cloud Metadata</h1>
        <p style={{ color: '#64748b' }}>View all processed file records synced from AWS S3, Lambda, and DynamoDB.</p>
      </div>

      <div className="card">
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
            <p>No file records found yet. Upload a file from the Home page to get started!</p>
            <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
              Go to Upload
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.875rem' }}>
                  <th style={{ padding: '0.75rem' }}>Filename</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Size</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Duplicate Check</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id || Math.random()} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500', color: '#1e293b' }}>{record.filename}</td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{record.fileType || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{record.originalSize || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: record.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
                        color: record.status === 'COMPLETED' ? '#166534' : '#991b1b'
                      }}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: record.duplicateStatus === 'DUPLICATE' ? '#fef3c7' : '#e0f2fe',
                        color: record.duplicateStatus === 'DUPLICATE' ? '#92400e' : '#0369a1'
                      }}>
                        {record.duplicateStatus || 'UNIQUE'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <Link to={`/file/${record.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        style={{ 
                          background: '#fee2e2', 
                          color: '#991b1b', 
                          border: 'none', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          cursor: 'pointer', 
                          fontWeight: '500',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}