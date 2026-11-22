import { useState } from 'react';
import { createBill } from '../../api/bills';
import { useEmployee } from '../../context/EmployeeContext';
import { useToast } from '../../context/ToastContext';
import { money } from '../../utils/format';

export default function BillSummary({ cart, onSaved }) {
  const [discount, setDiscount] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [saving, setSaving] = useState(false);
  const { current } = useEmployee();
  const toast = useToast();
  const off = Number(discount) || 0;

  const save = async () => {
    const tooMany = cart.lines.find((l) => l.quantity > l.product.stockQty);
    if (tooMany) return toast(`Only ${tooMany.product.stockQty} of ${tooMany.product.name} in stock`, 'error');
    if (off < 0 || off > cart.total) return toast('Discount must be between 0 and the bill total', 'error');
    setSaving(true);
    try {
      const items = cart.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity }));
      const bill = await createBill({ employeeId: current.id, paymentMode, discount: off, items });
      setDiscount('');
      onSaved(bill);
    } catch (e) { toast(e.message, 'error'); }
    setSaving(false);
  };
  return (
    <div className="totals">
      <div className="line"><span>Total</span><span>{money(cart.total)}</span></div>
      <div className="line"><span>Discount</span>
        <input type="number" min="0" className="input qty-input" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </div>
      <div className="line"><span>Payment</span>
        <select className="input" style={{ width: 120 }} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
          <option>CASH</option><option>UPI</option><option>CARD</option>
        </select>
      </div>
      <div className="line grand"><span>Net amount</span><span>{money(cart.total - off)}</span></div>
      <button className="btn" disabled={saving || !current || cart.lines.length === 0} onClick={save}>
        {saving ? 'Saving...' : 'Save bill'}
      </button>
    </div>
  );
}
