import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFileRecordById } from '../services/mockStorage';

export default function FileDetails() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const found = getFileRecordById(id);
    setRecord(found);
  }, [id]);

  if (!record) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>File record not found</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>The requested file metadata could not be located.</p>
        <Link to="/history" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
          &larr; Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/history" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
          &larr; Back to History
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>
            {record.filename}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Detailed execution metrics from serverless pipeline & DynamoDB</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>File Type / Format</span>
            <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>{record.fileType || 'N/A'}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pipeline Status</span>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.75rem', 
              fontWeight: '600',
              background: record.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
              color: record.status === 'COMPLETED' ? '#166534' : '#991b1b'
            }}>
              {record.status}
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Original Size</span>
            <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>{record.originalSize}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Processed Size</span>
            <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>{record.processedSize || 'N/A'}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Processing Duration</span>
            <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>{record.processingDuration || '1.2s'}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Duplicate Status</span>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.75rem', 
              fontWeight: '600',
              background: record.duplicateStatus === 'DUPLICATE' ? '#fef3c7' : '#e0f2fe',
              color: record.duplicateStatus === 'DUPLICATE' ? '#92400e' : '#0369a1'
            }}>
              {record.duplicateStatus || 'UNIQUE'}
            </span>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Execution Result & Notes</span>
          <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0, lineHeight: '1.5' }}>
            {record.processingResult || 'Successfully processed by AWS Lambda and cataloged in DynamoDB.'}
          </p>
        </div>
      </div>
    </div>
  );
}