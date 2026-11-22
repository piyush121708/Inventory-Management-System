import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import FormFooter from '../../components/ui/FormFooter';
import useForm from '../../hooks/useForm';
import useSubmit from '../../hooks/useSubmit';
import { createCategory, updateCategory } from '../../api/categories';

const validate = (v) => (v.name.trim() ? {} : { name: 'Name is required' });

export default function CategoryForm({ category, onClose, onSaved }) {
  const form = useForm({ name: category.name || '' }, validate);
  const { saving, error, run } = useSubmit(onSaved);
  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) return;
    const body = { name: form.values.name.trim() };
    run(() => (category.id ? updateCategory(category.id, body) : createCategory(body)), 'Category saved');
  };
  return (
    <Modal title={category.id ? 'Edit category' : 'Add category'} onClose={onClose}>
      <form onSubmit={submit} style={{ marginTop: 16 }}>
        <Field label="Category name" error={form.errors.name}><input className="input" {...form.bind('name')} /></Field>
        <FormFooter error={error} saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  );
}
