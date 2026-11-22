import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import EmployeeForm from './EmployeeForm';
import useFetch from '../../hooks/useFetch';
import useAction from '../../hooks/useAction';
import { useEmployee } from '../../context/EmployeeContext';
import { getEmployees, deactivateEmployee } from '../../api/employees';

export default function EmployeesPage() {
  const { data, loading, error, reload } = useFetch(getEmployees);
  const { refresh } = useEmployee();
  const [editing, setEditing] = useState(null);
  const after = () => { reload(); refresh(); };
  const run = useAction(after);
  const remove = (e) => run(() => deactivateEmployee(e.id), { confirm: `Deactivate ${e.name}?`, ok: 'Employee deactivated' });
  const saved = () => { setEditing(null); after(); };
  return (
    <>
      <PageHeader title="Employees" subtitle="Managers and cashiers who work at the store">
        <button className="btn" onClick={() => setEditing({})}>Add employee</button>
      </PageHeader>
      <DataState loading={loading} error={error} empty={data?.length === 0}>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Name</th><th>Phone</th><th>Role</th><th>Status</th><th /></tr></thead>
          <tbody>
            {(data || []).map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td><td>{e.phone || '-'}</td><td>{e.role}</td>
                <td><span className={e.active ? 'badge' : 'badge badge-off'}>{e.active ? 'Active' : 'Inactive'}</span></td>
                <td className="actions">
                  <button className="link-btn" onClick={() => setEditing(e)}>Edit</button>
                  {e.active && <button className="link-btn danger" onClick={() => remove(e)}>Deactivate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </DataState>
      {editing && <EmployeeForm employee={editing} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}
