import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import SupplierForm from './SupplierForm';
import useFetch from '../../hooks/useFetch';
import useAction from '../../hooks/useAction';
import { getSuppliers, deleteSupplier } from '../../api/suppliers';

export default function SuppliersPage() {
  const { data, loading, error, reload } = useFetch(getSuppliers);
  const [editing, setEditing] = useState(null);
  const run = useAction(reload);
  const remove = (s) => run(() => deleteSupplier(s.id), { confirm: `Delete ${s.name}?`, ok: 'Supplier deleted' });
  const saved = () => { setEditing(null); reload(); };
  return (
    <>
      <PageHeader title="Suppliers" subtitle="Wholesalers and vendors you buy stock from">
        <button className="btn" onClick={() => setEditing({})}>Add supplier</button>
      </PageHeader>
      <DataState loading={loading} error={error} empty={data?.length === 0}>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Name</th><th>Phone</th><th>Address</th><th /></tr></thead>
          <tbody>
            {(data || []).map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td><td>{s.phone || '-'}</td><td>{s.address || '-'}</td>
                <td className="actions">
                  <button className="link-btn" onClick={() => setEditing(s)}>Edit</button>
                  <button className="link-btn danger" onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </DataState>
      {editing && <SupplierForm supplier={editing} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}
