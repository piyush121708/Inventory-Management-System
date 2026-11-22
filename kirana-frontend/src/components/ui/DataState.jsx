// Shows loading / error / empty messages, otherwise the children.
export default function DataState({ loading, error, empty, emptyText = 'Nothing here yet.', children }) {
  if (loading) return <p className="state">Loading...</p>;
  if (error) return <p className="state state-error">{error}</p>;
  if (empty) return <p className="state">{emptyText}</p>;
  return children;
}
