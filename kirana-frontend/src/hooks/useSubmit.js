import { useState } from 'react';
import { useToast } from '../context/ToastContext';

// Wraps a save call: tracks saving state, shows the backend error inside the form.
export default function useSubmit(onDone) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const run = async (action, successMessage) => {
    setSaving(true);
    setError('');
    try {
      const result = await action();
      toast(successMessage);
      onDone(result);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };
  return { saving, error, run };
}
