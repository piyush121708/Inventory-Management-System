import { money } from '../../utils/format';

export default function BillItemsTable({ bill }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Item</th><th className="num">Price</th><th className="num">Qty</th><th className="num">Total</th></tr></thead>
        <tbody>
          {bill.items.map((i) => (
            <tr key={i.id}>
              <td>{i.product?.name}</td><td className="num">{money(i.unitPrice)}</td>
              <td className="num">{i.quantity}</td><td className="num">{money(i.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
