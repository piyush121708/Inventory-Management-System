export default function StatTile({ label, value }) {
  return (
    <div className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
