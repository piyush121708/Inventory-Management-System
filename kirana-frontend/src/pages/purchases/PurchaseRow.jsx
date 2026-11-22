import { money } from '../../utils/format';

export default function PurchaseRow({ row, products, onChange, onRemove }) {
  const pick = (id) => {
    const p = products.find((x) => x.id === Number(id));
    onChange({ ...row, productId: id, unitCost: row.unitCost || p?.costPrice || '' });
  };
  const set = (key) => (e) => onChange({ ...row, [key]: e.target.value });
  return (
    <div className="item-row">
      <select className="input" value={row.productId} onChange={(e) => pick(e.target.value)}>
        <option value="">Product...</option>
        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input type="number" min="1" className="input" placeholder="Qty" value={row.quantity} onChange={set('quantity')} />
      <input type="number" step="0.01" className="input" placeholder="Unit cost" value={row.unitCost} onChange={set('unitCost')} />
      <span className="num">{money((Number(row.quantity) || 0) * (Number(row.unitCost) || 0))}</span>
      <button type="button" className="link-btn danger" onClick={onRemove}>Remove</button>
    </div>
  );
}
