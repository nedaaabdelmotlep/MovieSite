export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const disablePrev = page <= 1;
  const disableNext = page >= totalPages;
  return (
    <div className="pagination">
      <button className="btn btn-ghost" disabled={disablePrev} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button className="btn btn-ghost" disabled={disableNext} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
