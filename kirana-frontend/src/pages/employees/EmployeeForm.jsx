import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import FormFooter from '../../components/ui/FormFooter';
import useForm from '../../hooks/useForm';
import useSubmit from '../../hooks/useSubmit';
import { createEmployee, updateEmployee } from '../../api/employees';

const validate = (v) => (v.name.trim() ? {} : { name: 'Name is required' });

export default function EmployeeForm({ employee, onClose, onSaved }) {
  const form = useForm({
    name: employee.name || '', phone: employee.phone || '',
    role: employee.role || 'CASHIER', active: employee.active ?? true,
  }, validate);
  const { saving, error, run } = useSubmit(onSaved);
  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) return;
    const body = { ...form.values, name: form.values.name.trim() };
    run(() => (employee.id ? updateEmployee(employee.id, body) : createEmployee(body)), 'Employee saved');
  };
  return (
    <Modal title={employee.id ? 'Edit employee' : 'Add employee'} onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <Field label="Name" error={form.errors.name} full><input className="input" {...form.bind('name')} /></Field>
        <Field label="Phone"><input className="input" {...form.bind('phone')} /></Field>
        <Field label="Role">
          <select className="input" {...form.bind('role')}>
            <option value="CASHIER">Cashier</option><option value="MANAGER">Manager</option>
          </select>
        </Field>
        {employee.id && (
          <label className="field full" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.values.active}
              onChange={(e) => form.setValues({ ...form.values, active: e.target.checked })} />
            Active
          </label>
        )}
        <div className="full"><FormFooter error={error} saving={saving} onCancel={onClose} /></div>
      </form>
    </Modal>
  );
}
