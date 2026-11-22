import { useToast } from '../context/ToastContext';

// For one-click actions on a list (delete / deactivate): confirm, call, toast, reload.
export default function useAction(reload) {
  const toast = useToast();
  return async (fn, { confirm, ok }) => {
    if (confirm && !window.confirm(confirm)) return;
    try {
      await fn();
      toast(ok);
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };
}
