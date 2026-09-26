// src/services/mockStorage.js

// Helper to manage mock files in localStorage so they persist across page navigation
const STORAGE_KEY = 'serverless_pipeline_files';

export const getStoredFiles = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredFiles = (files) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
};

export const addFileRecord = (file) => {
  const files = getStoredFiles();
  const newRecord = {
    id: 'file-' + Date.now(),
    filename: file.name,
    fileType: file.type || file.name.split('.').pop().toUpperCase(),
    originalSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    processedSize: ((file.size * 0.8) / (1024 * 1024)).toFixed(2) + ' MB', // Mock compression
    uploadTimestamp: new Date().toISOString(),
    processingTimestamp: null,
    processingDuration: null,
    status: 'UPLOADED', // UPLOADED -> QUEUED -> PROCESSING -> COMPLETED (or FAILED)
    duplicateStatus: 'UNIQUE',
    processingResult: null,
    errorMessage: null,
  };
  
  files.unshift(newRecord); // Add to the beginning of the list
  saveStoredFiles(files);
  return newRecord;
};

export const updateFileStatus = (id, status, extraFields = {}) => {
  const files = getStoredFiles();
  const updated = files.map(f => {
    if (f.id === id) {
      const updatedItem = { ...f, status, ...extraFields };
      if (status === 'COMPLETED' || status === 'FAILED') {
        updatedItem.processingTimestamp = new Date().toISOString();
        updatedItem.processingDuration = '2.4s';
      }
      return updatedItem;
    }
    return f;
  });
  saveStoredFiles(updated);
  return updated;
};