export default function FormFooter({ error, saving, onCancel, label = 'Save' }) {
  return (
    <>
      {error && <p className="form-error" style={{ marginTop: 14 }}>{error}</p>}
      <div className="form-footer">
        <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : label}</button>
      </div>
    </>
  );
}
