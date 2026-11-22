export default function Field({ label, error, full, children }) {
  return (
    <label className={full ? 'field full' : 'field'}>
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
