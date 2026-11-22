import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import ProductSearch from './ProductSearch';
import CartTable from './CartTable';
import BillSummary from './BillSummary';
import useCart from './useCart';
import { money } from '../../utils/format';

export default function BillingPage() {
  const cart = useCart();
  const [saved, setSaved] = useState(null);
  const [version, setVersion] = useState(0); // refetch product stock after a sale

  const done = (bill) => { cart.clear(); setSaved(bill); setVersion((v) => v + 1); };
  return (
    <>
      <PageHeader title="Billing" subtitle="Ring up a customer" />
      {saved && (
        <div className="notice">
          Bill {saved.billNumber} saved for {money(saved.netAmount)}. <Link to={`/bills/${saved.id}`}>Open bill</Link>
        </div>
      )}
      <div className="pos">
        <ProductSearch onAdd={cart.add} version={version} />
        <div className="panel">
          <h3>Current bill</h3>
          <CartTable cart={cart} />
          <BillSummary cart={cart} onSaved={done} />
        </div>
      </div>
    </>
  );
}
