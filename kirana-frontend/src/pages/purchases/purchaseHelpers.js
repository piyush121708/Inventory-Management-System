export const emptyRow = () => ({ productId: '', quantity: 1, unitCost: '' });

// Mirrors PurchaseRequest validation on the backend. Returns an error message or ''.
export function validatePurchase(supplierId, rows) {
  if (!supplierId) return 'Choose a supplier';
  if (rows.length === 0) return 'Add at least one item';
  for (const r of rows) {
    if (!r.productId) return 'Choose a product for every row';
    if (!(Number(r.quantity) >= 1)) return 'Quantity must be at least 1';
    if (!(Number(r.unitCost) >= 0.01)) return 'Unit cost must be at least 0.01';
  }
  return '';
}

export const rowsTotal = (rows) => rows.reduce((s, r) => s + (Number(r.quantity) || 0) * (Number(r.unitCost) || 0), 0);

export const toItems = (rows) => rows.map((r) => ({
  productId: Number(r.productId), quantity: Number(r.quantity), unitCost: Number(r.unitCost),
}));
