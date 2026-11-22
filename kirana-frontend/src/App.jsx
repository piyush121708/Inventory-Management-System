import { EmployeeProvider } from './context/EmployeeContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ToastProvider>
      <EmployeeProvider>
        <AppRoutes />
      </EmployeeProvider>
    </ToastProvider>
  );
}
