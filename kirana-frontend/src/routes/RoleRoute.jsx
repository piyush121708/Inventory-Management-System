import { useEmployee } from '../context/EmployeeContext';

// Blocks a page for cashiers. (The backend only enforces purchases and stock adjustments.)
export default function RoleRoute({ children }) {
  const { current, isManager } = useEmployee();
  if (!current) return <p className="state">Loading...</p>;
  if (!isManager) return <p className="state state-error">Only a manager can open this page.</p>;
  return children;
}
