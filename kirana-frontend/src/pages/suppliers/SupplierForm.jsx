import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import FormFooter from '../../components/ui/FormFooter';
import useForm from '../../hooks/useForm';
import useSubmit from '../../hooks/useSubmit';
import { createSupplier, updateSupplier } from '../../api/suppliers';

const validate = (v) => (v.name.trim() ? {} : { name: 'Name is required' });

export default function SupplierForm({ supplier, onClose, onSaved }) {
  const { name = '', phone = '', address = '' } = supplier;
  const form = useForm({ name, phone: phone || '', address: address || '' }, validate);
  const { saving, error, run } = useSubmit(onSaved);
  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) return;
    const body = { ...form.values, name: form.values.name.trim() };
    run(() => (supplier.id ? updateSupplier(supplier.id, body) : createSupplier(body)), 'Supplier saved');
  };
  return (
    <Modal title={supplier.id ? 'Edit supplier' : 'Add supplier'} onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <Field label="Supplier name" error={form.errors.name} full><input className="input" {...form.bind('name')} /></Field>
        <Field label="Phone"><input className="input" {...form.bind('phone')} /></Field>
        <Field label="Address"><input className="input" {...form.bind('address')} /></Field>
        <div className="full"><FormFooter error={error} saving={saving} onCancel={onClose} /></div>
      </form>
    </Modal>
  );
}
