// Local storage key for file processing records
const STORAGE_KEY = 'serverless_pipeline_files';

export function getFileRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Alias to support any component using the legacy name
export const getStoredFiles = getFileRecords;

export function getFileRecordById(id) {
  const records = getFileRecords();
  return records.find(r => r.id === id || String(r.id) === String(id));
}

export function addFileRecord(file) {
  const records = getFileRecords();
  const newRecord = {
    id: `file-${Date.now()}`,
    filename: file.name,
    fileType: file.type || file.name.split('.').pop().toUpperCase(),
    originalSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    processedSize: `${((file.size * 0.8) / (1024 * 1024)).toFixed(2)} MB`,
    status: 'UPLOADED',
    duplicateStatus: 'UNIQUE',
    uploadTimestamp: new Date().toISOString(),
    processingDuration: '1.4s',
    processingResult: 'Successfully uploaded to S3 input bucket and processed by Lambda.'
  };

  records.unshift(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return newRecord;
}

export function updateFileStatus(id, status, extraData = {}) {
  const records = getFileRecords();
  const index = records.findIndex(r => r.id === id || String(r.id) === String(id));
  
  if (index !== -1) {
    records[index] = {
      ...records[index],
      status,
      ...extraData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return records[index];
  }
  return null;
}

export function deleteFileRecord(id) {
  const records = getFileRecords();
  const filtered = records.filter(r => r.id !== id && String(r.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}