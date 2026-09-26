function StatusCard({ status }) {
  const statuses = [
    "UPLOADED",
    "QUEUED",
    "PROCESSING",
    "COMPLETED",
  ];

  const currentIndex = statuses.indexOf(status);

  return (
    <div className="status-card">
      <h3>Processing Status</h3>

      {/* Status Flow */}
      <div className="status-flow">
        {statuses.map((item, index) => (
          <div
            key={item}
            className={`status-step ${
              index <= currentIndex ? "active" : ""
            } ${item === status ? "current" : ""}`}
          >
            <div className="status-circle">
              {index + 1}
            </div>

            <span>{item}</span>

            {index < statuses.length - 1 && (
              <div className="status-line"></div>
            )}
          </div>
        ))}
      </div>

      {/* Failed Message */}
      {status === "FAILED" && (
        <div className="failed-message">
          Processing failed. Please check the file and try again.
        </div>
      )}

      {/* Current Status */}
      <p className="current-status">
        Current Status: <strong>{status}</strong>
      </p>
    </div>
  );
}

export default StatusCard;