import React, { useEffect, useState } from 'react';
import { getStoredFiles } from '../services/mockStorage';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    queued: 0,
    failed: 0,
    duplicates: 0,
  });

  useEffect(() => {
    const files = getStoredFiles();
    setStats({
      total: files.length,
      completed: files.filter(f => f.status === 'COMPLETED').length,
      processing: files.filter(f => f.status === 'PROCESSING').length,
      queued: files.filter(f => f.status === 'QUEUED' || f.status === 'UPLOADED').length,
      failed: files.filter(f => f.status === 'FAILED').length,
      duplicates: files.filter(f => f.duplicateStatus === 'DUPLICATE').length,
    });
  }, []);

  const statCards = [
    { label: 'Total Files', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Processing', value: stats.processing, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { label: 'Queued', value: stats.queued, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Failed', value: stats.failed, color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Duplicates', value: stats.duplicates, color: 'bg-gray-50 text-gray-700 border-gray-200' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 pt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">System Dashboard</h1>
      <p className="text-gray-600 mb-8">Overview of pipeline metrics and file processing statistics.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`p-6 rounded-xl border ${card.color} shadow-sm`}>
            <p className="text-sm font-medium uppercase tracking-wider">{card.label}</p>
            <p className="text-4xl font-extrabold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}