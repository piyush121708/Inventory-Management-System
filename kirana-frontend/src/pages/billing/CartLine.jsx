import { money } from '../../utils/format';

export default function CartLine({ line, onQty, onRemove }) {
  const { product: p, quantity } = line;
  return (
    <tr>
      <td>{p.name}<br /><small className={quantity > p.stockQty ? 'low' : 'muted'}>in stock: {p.stockQty}</small></td>
      <td className="num">{money(p.sellingPrice)}</td>
      <td className="num">
        <input type="number" min="1" className="input qty-input" value={quantity}
          onChange={(e) => onQty(p.id, Math.max(1, Number(e.target.value) || 1))} />
      </td>
      <td className="num">{money(p.sellingPrice * quantity)}</td>
      <td><button className="link-btn danger" onClick={() => onRemove(p.id)}>Remove</button></td>
    </tr>
  );
}
