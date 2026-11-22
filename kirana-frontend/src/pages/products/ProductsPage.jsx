import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import ProductTable from './ProductTable';
import ProductToolbar from './ProductToolbar';
import ProductForm from './ProductForm';
import useFetch from '../../hooks/useFetch';
import useAction from '../../hooks/useAction';
import { useEmployee } from '../../context/EmployeeContext';
import { getProducts, getLowStock, deactivateProduct } from '../../api/products';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const [tab, setTab] = useState('all');
  const [editing, setEditing] = useState(null); // null = closed, {} = new product
  const { isManager } = useEmployee();
  const { data, loading, error, reload } = useFetch(
    () => (tab === 'low' ? getLowStock() : getProducts(search)), [tab, search]);
  const run = useAction(reload);
  const remove = (p) => run(() => deactivateProduct(p.id), { confirm: `Remove ${p.name}?`, ok: 'Product removed' });
  const saved = () => { setEditing(null); reload(); };

  return (
    <>
      <PageHeader title="Products" subtitle="Everything on the shelf and how much is left">
        {isManager && <button className="btn" onClick={() => setEditing({})}>Add product</button>}
      </PageHeader>
      <ProductToolbar tab={tab} setTab={setTab} search={search}
        setSearch={(v) => setParams(v ? { search: v } : {}, { replace: true })} />
      <DataState loading={loading} error={error} empty={data?.length === 0} emptyText="No products found.">
        <ProductTable products={data || []} canEdit={isManager} onEdit={setEditing} onRemove={remove} />
      </DataState>
      {editing && <ProductForm product={editing} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}
