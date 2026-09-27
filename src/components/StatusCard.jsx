import React from 'react';

export default function StatusCard({ status, filename, errorMessage }) {
  return (
    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: '600', color: '#334155' }}>{filename}</span>
        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
        {status === 'UPLOADED' && 'File received in local staging state.'}
        {status === 'QUEUED' && 'Job placed in asynchronous queue.'}
        {status === 'PROCESSING' && 'Lambda execution in progress...'}
        {status === 'COMPLETED' && 'File successfully processed and stored!'}
        {status === 'FAILED' && (errorMessage || 'Processing failed.')}
      </p>
    </div>
  );
}