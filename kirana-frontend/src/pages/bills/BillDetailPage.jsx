import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import BillItemsTable from './BillItemsTable';
import useFetch from '../../hooks/useFetch';
import { getBill } from '../../api/bills';
import { money, dateTime } from '../../utils/format';

export default function BillDetailPage() {
  const { id } = useParams();
  const { data: bill, loading, error } = useFetch(() => getBill(id), [id]);
  return (
    <>
      <PageHeader title={bill ? `Bill ${bill.billNumber}` : 'Bill'}>
        <Link className="btn btn-light" to="/bills">Back</Link>
        <button className="btn" onClick={() => window.print()}>Print</button>
      </PageHeader>
      <DataState loading={loading} error={error}>
        {bill && (
          <>
            <div className="bill-meta">
              <div><small>Date</small>{dateTime(bill.billDate)}</div>
              <div><small>Cashier</small>{bill.employee?.name}</div>
              <div><small>Payment</small>{bill.paymentMode}</div>
            </div>
            <BillItemsTable bill={bill} />
            <div className="totals" style={{ maxWidth: 320, marginLeft: 'auto' }}>
              <div className="line"><span>Total</span><span>{money(bill.totalAmount)}</span></div>
              <div className="line"><span>Discount</span><span>{money(bill.discount)}</span></div>
              <div className="line grand"><span>Net amount</span><span>{money(bill.netAmount)}</span></div>
            </div>
          </>
        )}
      </DataState>
    </>
  );
}
