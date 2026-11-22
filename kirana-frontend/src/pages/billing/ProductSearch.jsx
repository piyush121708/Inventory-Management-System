import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';
import { getProducts, getByBarcode } from '../../api/products';
import { money } from '../../utils/format';

export default function ProductSearch({ onAdd, version }) {
  const [term, setTerm] = useState('');
  const [code, setCode] = useState('');
  const toast = useToast();
  const q = useDebounce(term);
  const { data, loading, error } = useFetch(() => getProducts(q), [q, version]);

  const scan = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    try { onAdd(await getByBarcode(code.trim())); setCode(''); }
    catch (err) { toast(err.message, 'error'); }
  };
  return (
    <div className="panel">
      <h3>Add products</h3>
      <div className="pos-search">
        <input className="input" placeholder="Search by name" value={term} onChange={(e) => setTerm(e.target.value)} />
        <form onSubmit={scan}>
          <input className="input" placeholder="Barcode, press Enter" value={code} onChange={(e) => setCode(e.target.value)} />
        </form>
      </div>
      {error && <p className="form-error">{error}</p>}
      {loading && !data && <p className="muted">Loading...</p>}
      <div className="pick-list">
        {(data || []).map((p) => (
          <div className="pick" key={p.id}>
            <div>{p.name}<br /><small className="muted">{money(p.sellingPrice)} / {p.unit} - stock {p.stockQty}</small></div>
            <button className="btn btn-sm" disabled={p.stockQty < 1} onClick={() => onAdd(p)}>
              {p.stockQty < 1 ? 'Out of stock' : 'Add'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
