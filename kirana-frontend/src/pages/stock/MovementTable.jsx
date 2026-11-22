import { dateTime } from '../../utils/format';

export default function MovementTable({ rows }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Date</th><th>Product</th><th>Type</th><th className="num">Change</th><th className="num">Balance</th><th>Note</th><th>By</th></tr></thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id}>
              <td>{dateTime(m.createdAt)}</td><td>{m.product?.name}</td>
              <td><span className="badge">{m.type}</span></td>
              <td className={m.quantityChange < 0 ? 'num low' : 'num'}>{m.quantityChange > 0 ? '+' : ''}{m.quantityChange}</td>
              <td className="num">{m.balanceAfter}</td><td>{m.note || '-'}</td><td>{m.performedBy?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
