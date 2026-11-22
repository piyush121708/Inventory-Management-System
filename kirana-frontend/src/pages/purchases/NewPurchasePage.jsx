import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Field from '../../components/ui/Field';
import DataState from '../../components/ui/DataState';
import PurchaseRow from './PurchaseRow';
import useFetch from '../../hooks/useFetch';
import { useEmployee } from '../../context/EmployeeContext';
import { useToast } from '../../context/ToastContext';
import { getSuppliers } from '../../api/suppliers';
import { getProducts } from '../../api/products';
import { createPurchase } from '../../api/purchases';
import { emptyRow, validatePurchase, rowsTotal, toItems } from './purchaseHelpers';
import { money, today } from '../../utils/format';

export default function NewPurchasePage() {
  const suppliers = useFetch(getSuppliers);
  const products = useFetch(() => getProducts(''));
  const { current } = useEmployee();
  const toast = useToast();
  const navigate = useNavigate();
  const [supplierId, setSupplierId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(today());
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    const problem = validatePurchase(supplierId, rows);
    setError(problem);
    if (problem) return;
    setSaving(true);
    try {
      await createPurchase({ supplierId: Number(supplierId), employeeId: current.id,
        invoiceNo: invoiceNo.trim() || null, purchaseDate, items: toItems(rows) });
      toast('Purchase recorded, stock updated');
      navigate('/purchases');
    } catch (err) { setError(err.message); setSaving(false); }
  };
  const change = (i) => (row) => setRows(rows.map((r, n) => (n === i ? row : r)));
  return (
    <>
      <PageHeader title="New purchase" subtitle="Stock is added when you save">
        <Link className="btn btn-light" to="/purchases">Back</Link>
      </PageHeader>
      <DataState loading={suppliers.loading || products.loading} error={suppliers.error || products.error}>
        <form className="panel" onSubmit={save}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: 0 }}>
            <Field label="Supplier">
              <select className="input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                <option value="">Select...</option>
                {(suppliers.data || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Invoice no."><input className="input" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} /></Field>
            <Field label="Date"><input type="date" className="input" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} /></Field>
          </div>
          <div className="item-rows">
            {rows.map((r, i) => (
              <PurchaseRow key={i} row={r} products={products.data || []} onChange={change(i)}
                onRemove={() => setRows(rows.filter((_, n) => n !== i))} />
            ))}
          </div>
          <button type="button" className="btn btn-light btn-sm" style={{ marginTop: 12 }} onClick={() => setRows([...rows, emptyRow()])}>Add item</button>
          <div className="totals"><div className="line grand"><span>Total</span><span>{money(rowsTotal(rows))}</span></div></div>
          {error && <p className="form-error" style={{ marginTop: 10 }}>{error}</p>}
          <div className="form-footer"><button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save purchase'}</button></div>
        </form>
      </DataState>
    </>
  );
}
