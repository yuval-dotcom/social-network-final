export function LoadingSkeleton({ lines = 3, className = "" }) {
  return (
    <div className={`skeleton-container ${className}`} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }, (_, i) => (
        <div
          className="skeleton-line"
          key={i}
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 2 }) {
  return (
    <div className="skeleton-card-list">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-card-header">
            <div className="skeleton-avatar" />
            <div className="skeleton-header-lines">
              <div className="skeleton-line" style={{ width: "40%" }} />
              <div className="skeleton-line" style={{ width: "25%" }} />
            </div>
          </div>
          <div className="skeleton-line" style={{ width: "100%", marginTop: 16 }} />
          <div className="skeleton-line" style={{ width: "85%" }} />
          <div className="skeleton-line" style={{ width: "60%" }} />
        </div>
      ))}
    </div>
  );
}
