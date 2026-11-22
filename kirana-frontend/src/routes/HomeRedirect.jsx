import { Navigate } from 'react-router-dom';
import { useEmployee } from '../context/EmployeeContext';

export default function HomeRedirect() {
  const { current, isManager } = useEmployee();
  if (!current) return <p className="state">Loading...</p>;
  return <Navigate to={isManager ? '/dashboard' : '/billing'} replace />;
}
