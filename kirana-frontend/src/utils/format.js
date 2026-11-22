export const money = (n) =>
  '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const dateTime = (v) =>
  v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-';

export const dateOnly = (v) =>
  v ? new Date(v).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

export const today = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
