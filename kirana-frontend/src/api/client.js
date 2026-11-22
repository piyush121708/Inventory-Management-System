const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '');

// Single place that talks to the backend. Errors from the backend look like
// { timestamp, status, message } so we surface `message` to the UI.
export async function request(path, method = 'GET', body) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running on port 8080?');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}
