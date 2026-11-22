import { Link } from 'react-router-dom';
import DataState from '../../components/ui/DataState';
import StatTile from './StatTile';
import ProductTable from '../products/ProductTable';
import useFetch from '../../hooks/useFetch';
import { useEmployee } from '../../context/EmployeeContext';
import { getDashboard } from '../../api/dashboard';
import { getLowStock } from '../../api/products';
import { money } from '../../utils/format';

export default function DashboardPage() {
  const { current } = useEmployee();
  const summary = useFetch(getDashboard);
  const low = useFetch(getLowStock);
  const d = summary.data;
  return (
    <DataState loading={summary.loading} error={summary.error}>
      {d && (
        <>
          <div className="hero">
            <div>
              <span className="hero-tag">Hello, {current?.name}</span>
              <h2>Here is how the store<br />is doing today</h2>
              <p>{d.todayBills} bills so far, {d.lowStockCount} products running low.</p>
              <Link className="btn" to="/billing">Start billing</Link>
            </div>
            <div className="hero-figure"><small>Sales today</small><strong>{money(d.todaySales)}</strong></div>
          </div>
          <div className="stats">
            <StatTile label="Products" value={d.totalProducts} />
            <StatTile label="Low stock" value={d.lowStockCount} />
            <StatTile label="Suppliers" value={d.totalSuppliers} />
            <StatTile label="Bills today" value={d.todayBills} />
          </div>
          <h2 className="section-title">Running low</h2>
          <DataState loading={low.loading} error={low.error} empty={low.data?.length === 0} emptyText="Nothing is running low.">
            <ProductTable products={low.data || []} />
          </DataState>
        </>
      )}
    </DataState>
  );
}
