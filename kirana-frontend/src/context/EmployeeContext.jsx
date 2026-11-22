import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getEmployees } from '../api/employees';

const EmployeeContext = createContext(null);
export const useEmployee = () => useContext(EmployeeContext);

// The backend has no login. The "Working as" employee takes its place and its id
// is sent with bills, purchases and stock adjustments.
export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(Number(localStorage.getItem('employeeId')) || null);

  const refresh = useCallback(() => {
    getEmployees().then(setEmployees).catch((e) => setError(e.message));
  }, []);
  useEffect(refresh, [refresh]);

  const active = employees.filter((e) => e.active);
  const current = active.find((e) => e.id === selectedId) || active[0] || null;
  const select = (id) => { localStorage.setItem('employeeId', id); setSelectedId(id); };
  const isManager = current?.role === 'MANAGER';

  return (
    <EmployeeContext.Provider value={{ active, current, select, isManager, refresh, error }}>
      {children}
    </EmployeeContext.Provider>
  );
}
