import Modal from '../../components/ui/Modal';
import { money, dateOnly } from '../../utils/format';

export default function PurchaseDetail({ purchase: p, onClose }) {
  return (
    <Modal title={`Purchase #${p.id}`} onClose={onClose} wide>
      <div className="bill-meta" style={{ marginTop: 14 }}>
        <div><small>Supplier</small>{p.supplier?.name}</div>
        <div><small>Invoice</small>{p.invoiceNo || '-'}</div>
        <div><small>Date</small>{dateOnly(p.purchaseDate)}</div>
        <div><small>Recorded by</small>{p.createdBy?.name || '-'}</div>
      </div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Product</th><th className="num">Qty</th><th className="num">Unit cost</th><th className="num">Total</th></tr></thead>
        <tbody>
          {p.items.map((i) => (
            <tr key={i.id}>
              <td>{i.product?.name}</td><td className="num">{i.quantity}</td>
              <td className="num">{money(i.unitCost)}</td><td className="num">{money(i.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <p className="num" style={{ marginTop: 12, fontWeight: 800 }}>Total {money(p.totalAmount)}</p>
    </Modal>
  );
}
