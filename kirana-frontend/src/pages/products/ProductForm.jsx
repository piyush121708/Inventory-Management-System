import Modal from '../../components/ui/Modal';
import FormFooter from '../../components/ui/FormFooter';
import ProductFields from './ProductFields';
import useFetch from '../../hooks/useFetch';
import useForm from '../../hooks/useForm';
import useSubmit from '../../hooks/useSubmit';
import { getCategories } from '../../api/categories';
import { createProduct, updateProduct } from '../../api/products';
import { toForm, validateProduct, toPayload } from './productFormUtils';

export default function ProductForm({ product, onClose, onSaved }) {
  const isNew = !product.id;
  const { data: categories } = useFetch(getCategories);
  const form = useForm(toForm(product), validateProduct);
  const { saving, error, run } = useSubmit(onSaved);

  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) return;
    const body = toPayload(form.values);
    run(() => (isNew ? createProduct(body) : updateProduct(product.id, body)), 'Product saved');
  };
  return (
    <Modal title={isNew ? 'Add product' : 'Edit product'} onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <ProductFields bind={form.bind} errors={form.errors} categories={categories || []} isNew={isNew} />
        <div className="full"><FormFooter error={error} saving={saving} onCancel={onClose} /></div>
      </form>
    </Modal>
  );
}
