import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFileRecords } from '../services/mockStorage';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalFiles: 0,
    completedFiles: 0,
    duplicateFiles: 0,
    totalSize: '0 MB'
  });
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    try {
      const records = getFileRecords();
      const validRecords = Array.isArray(records) ? records : [];
      
      const totalFiles = validRecords.length;
      const completedFiles = validRecords.filter(r => r.status === 'COMPLETED').length;
      const duplicateFiles = validRecords.filter(r => r.duplicateStatus === 'DUPLICATE').length;
      
      // Calculate total size roughly
      let sizeNum = validRecords.reduce((acc, curr) => {
        const sizeStr = curr.originalSize || '0 MB';
        const num = parseFloat(sizeStr.replace(' MB', '')) || 0;
        return acc + num;
      }, 0);

      setStats({
        totalFiles,
        completedFiles,
        duplicateFiles,
        totalSize: `${sizeNum.toFixed(2)} MB`
      });

      setRecentRecords(validRecords.slice(0, 5)); // Get top 5 recent
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  }, []);

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Serverless Pipeline Dashboard</h1>
        <p style={{ color: '#64748b' }}>Real-time telemetry and execution metrics from AWS S3, Lambda, SQS, and DynamoDB.</p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Total Files Processed</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalFiles}</span>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Completed Jobs</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>{stats.completedFiles}</span>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Duplicates Flagged</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>{stats.duplicateFiles}</span>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Total Data Volume</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0284c7' }}>{stats.totalSize}</span>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Recent Pipeline Ingestion</h2>
          <Link to="/history" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            View All History &rarr;
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>No pipeline activity recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.875rem' }}>
                  <th style={{ padding: '0.5rem' }}>Filename</th>
                  <th style={{ padding: '0.5rem' }}>Size</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                  <th style={{ padding: '0.5rem' }}>Duplicate Check</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
                    <td style={{ padding: '0.5rem', fontWeight: '500', color: '#1e293b' }}>{record.filename}</td>
                    <td style={{ padding: '0.5rem', color: '#64748b' }}>{record.originalSize}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ padding: '0.15rem 0.4rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600', background: '#dcfce7', color: '#166534' }}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ padding: '0.15rem 0.4rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600', background: '#e0f2fe', color: '#0369a1' }}>
                        {record.duplicateStatus || 'UNIQUE'}
                      </span>
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