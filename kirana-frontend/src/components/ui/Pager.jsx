export default function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pager">
      <button className="btn btn-light btn-sm" disabled={page === 0} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page + 1} of {totalPages}</span>
      <button className="btn btn-light btn-sm" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}
