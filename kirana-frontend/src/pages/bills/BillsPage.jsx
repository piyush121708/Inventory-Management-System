import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import useFetch from '../../hooks/useFetch';
import { getBills } from '../../api/bills';
import { money, dateTime } from '../../utils/format';

export default function BillsPage() {
  const [date, setDate] = useState('');
  const { data, loading, error } = useFetch(() => getBills(date), [date]);
  return (
    <>
      <PageHeader title="Bills" subtitle="Latest bills first">
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        {date && <button className="btn btn-light" onClick={() => setDate('')}>Show all</button>}
      </PageHeader>
      <DataState loading={loading} error={error} empty={data?.length === 0} emptyText="No bills found.">
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Bill no.</th><th>Date</th><th>Cashier</th><th>Payment</th><th className="num">Net amount</th><th /></tr></thead>
          <tbody>
            {(data || []).map((b) => (
              <tr key={b.id}>
                <td>{b.billNumber}</td><td>{dateTime(b.billDate)}</td><td>{b.employee?.name}</td>
                <td>{b.paymentMode}</td><td className="num">{money(b.netAmount)}</td>
                <td className="actions"><Link to={`/bills/${b.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </DataState>
    </>
  );
}
