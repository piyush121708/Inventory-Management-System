import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const show = useCallback((message, type = 'ok') => {
    clearTimeout(timeout.current);
    setToast({ message, type });
    timeout.current = setTimeout(() => setToast(null), 3500);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </ToastContext.Provider>
  );
}
