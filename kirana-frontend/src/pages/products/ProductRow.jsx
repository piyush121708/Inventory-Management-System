import { money } from '../../utils/format';

export default function ProductRow({ p, canEdit, onEdit, onRemove }) {
  const low = p.stockQty <= p.reorderLevel;
  return (
    <tr>
      <td>{p.name} <small className="muted">/ {p.unit}</small></td>
      <td>{p.category?.name}</td>
      <td className="muted">{p.barcode || '-'}</td>
      <td className="num">{money(p.sellingPrice)}</td>
      <td className={low ? 'num low' : 'num'}>{p.stockQty}</td>
      <td className="num">{p.reorderLevel}</td>
      {canEdit && (
        <td className="actions">
          <button className="link-btn" onClick={() => onEdit(p)}>Edit</button>
          <button className="link-btn danger" onClick={() => onRemove(p)}>Remove</button>
        </td>
      )}
    </tr>
  );
}
