import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "text/csv",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
  ".csv",
  ".txt",
];

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setError("");
    setMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Check empty file
    if (file.size === 0) {
      setSelectedFile(null);
      setError("The selected file is empty.");
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("File is too large. Maximum allowed size is 5 MB.");
      return;
    }

    // Check file type
    const fileName = file.name.toLowerCase();

    const hasValidExtension = ALLOWED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension)
    );

    const hasValidMimeType = ALLOWED_TYPES.includes(file.type);

    if (!hasValidExtension || !hasValidMimeType) {
      setSelectedFile(null);
      setError(
        "Unsupported file type. Allowed: JPG, JPEG, PNG, PDF, CSV, TXT."
      );
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setMessage("");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    // Temporary message.
    // Actual AWS upload will be implemented later.
    setMessage(
      `"${selectedFile.name}" is ready for cloud upload.`
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="upload-card">
      <h2>Upload Your File</h2>

      <p className="supported-text">
        Supported formats:
      </p>

      <p className="file-types">
        JPG • JPEG • PNG • PDF • CSV • TXT
      </p>

      <p className="size-limit">
        Maximum file size: 5 MB
      </p>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf,.csv,.txt"
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {selectedFile && (
        <div className="selected-file">
          <h3>Selected File</h3>

          <p>
            <strong>Name:</strong> {selectedFile.name}
          </p>

          <p>
            <strong>Size:</strong>{" "}
            {formatFileSize(selectedFile.size)}
          </p>

          <p>
            <strong>Type:</strong>{" "}
            {selectedFile.type || "Unknown"}
          </p>

          <button
            className="remove-button"
            onClick={removeFile}
          >
            Remove File
          </button>
        </div>
      )}

      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload File
      </button>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}
    </div>
  );
}

export default FileUpload;