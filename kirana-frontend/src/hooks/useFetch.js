import { useCallback, useEffect, useRef, useState } from 'react';

// Runs an API call on mount (and whenever deps change). Call reload() after a change.
// Older responses that arrive late are ignored.
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const latest = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    const id = ++latest.current;
    const current = () => id === latest.current;
    setLoading(true);
    setError('');
    fn()
      .then((d) => current() && setData(d))
      .catch((e) => current() && setError(e.message))
      .finally(() => current() && setLoading(false));
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}
