export default function ProductToolbar({ tab, setTab, search, setSearch }) {
  const cls = (name) => (tab === name ? 'tab on' : 'tab');
  return (
    <div className="toolbar">
      <div className="tabs">
        <button className={cls('all')} onClick={() => setTab('all')}>All products</button>
        <button className={cls('low')} onClick={() => setTab('low')}>Low stock</button>
      </div>
      {tab === 'all' && (
        <input className="input" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
      )}
    </div>
  );
}
