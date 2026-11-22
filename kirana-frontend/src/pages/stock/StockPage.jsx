import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import Pager from '../../components/ui/Pager';
import MovementTable from './MovementTable';
import AdjustForm from './AdjustForm';
import useFetch from '../../hooks/useFetch';
import { useEmployee } from '../../context/EmployeeContext';
import { getMovements } from '../../api/stock';
import { getProducts } from '../../api/products';

export default function StockPage() {
  const [productId, setProductId] = useState('');
  const [page, setPage] = useState(0);
  const [adjusting, setAdjusting] = useState(false);
  const { isManager } = useEmployee();
  const products = useFetch(() => getProducts(''));
  const { data, loading, error, reload } = useFetch(() => getMovements(productId, page), [productId, page]);
  const saved = () => { setAdjusting(false); products.reload(); reload(); };
  const filter = (id) => { setProductId(id); setPage(0); };
  return (
    <>
      <PageHeader title="Stock history" subtitle="Every change in stock, newest first">
        <select className="input" value={productId} onChange={(e) => filter(e.target.value)}>
          <option value="">All products</option>
          {(products.data || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {isManager && <button className="btn" onClick={() => setAdjusting(true)}>Adjust stock</button>}
      </PageHeader>
      <DataState loading={loading} error={error} empty={data?.content.length === 0} emptyText="No stock movements found.">
        <MovementTable rows={data?.content || []} />
        <Pager page={page} totalPages={data?.totalPages || 0} onChange={setPage} />
      </DataState>
      {adjusting && <AdjustForm products={products.data || []} onClose={() => setAdjusting(false)} onSaved={saved} />}
    </>
  );
}
