import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import FormFooter from '../../components/ui/FormFooter';
import useForm from '../../hooks/useForm';
import useSubmit from '../../hooks/useSubmit';
import { useEmployee } from '../../context/EmployeeContext';
import { adjustStock } from '../../api/stock';

function validate(v) {
  const e = {};
  if (!v.productId) e.productId = 'Choose a product';
  if (!Number(v.quantityChange)) e.quantityChange = 'Enter a number other than 0';
  if (!v.note.trim()) e.note = 'A note is required';
  return e;
}

export default function AdjustForm({ products, onClose, onSaved }) {
  const { current } = useEmployee();
  const form = useForm({ productId: '', quantityChange: '', note: '' }, validate);
  const { saving, error, run } = useSubmit(onSaved);
  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) return;
    const v = form.values;
    run(() => adjustStock({ productId: Number(v.productId), employeeId: current.id,
      quantityChange: Number(v.quantityChange), note: v.note.trim() }), 'Stock adjusted');
  };
  return (
    <Modal title="Adjust stock" onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <Field label="Product" error={form.errors.productId} full>
          <select className="input" {...form.bind('productId')}>
            <option value="">Select...</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock {p.stockQty})</option>)}
          </select>
        </Field>
        <Field label="Change (use - to reduce)" error={form.errors.quantityChange}><input type="number" className="input" {...form.bind('quantityChange')} /></Field>
        <Field label="Reason" error={form.errors.note}><input className="input" placeholder="Expired, damaged..." {...form.bind('note')} /></Field>
        <div className="full"><FormFooter error={error} saving={saving} onCancel={onClose} /></div>
      </form>
    </Modal>
  );
}
