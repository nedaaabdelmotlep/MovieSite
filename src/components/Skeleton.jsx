export default function Skeleton({ rows = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-card" />)
      )}
    </div>
  );
}
