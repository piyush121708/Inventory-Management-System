import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import PurchaseDetail from './PurchaseDetail';
import useFetch from '../../hooks/useFetch';
import { getPurchases } from '../../api/purchases';
import { money, dateOnly } from '../../utils/format';

export default function PurchasesPage() {
  const { data, loading, error } = useFetch(getPurchases);
  const [open, setOpen] = useState(null);
  return (
    <>
      <PageHeader title="Purchases" subtitle="Stock bought from suppliers">
        <Link className="btn" to="/purchases/new">New purchase</Link>
      </PageHeader>
      <DataState loading={loading} error={error} empty={data?.length === 0} emptyText="No purchases recorded yet.">
        <div className="table-wrap"><table className="table">
          <thead><tr><th>#</th><th>Date</th><th>Invoice</th><th>Supplier</th><th className="num">Items</th><th className="num">Total</th><th /></tr></thead>
          <tbody>
            {(data || []).map((p) => (
              <tr key={p.id}>
                <td className="muted">{p.id}</td><td>{dateOnly(p.purchaseDate)}</td><td>{p.invoiceNo || '-'}</td>
                <td>{p.supplier?.name}</td><td className="num">{p.items.length}</td><td className="num">{money(p.totalAmount)}</td>
                <td className="actions"><button className="link-btn" onClick={() => setOpen(p)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </DataState>
      {open && <PurchaseDetail purchase={open} onClose={() => setOpen(null)} />}
    </>
  );
}
