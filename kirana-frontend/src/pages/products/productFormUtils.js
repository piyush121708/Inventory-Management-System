export const toForm = (p) => ({
  name: p.name || '',
  barcode: p.barcode || '',
  categoryId: p.category?.id || '',
  unit: p.unit || 'pcs',
  sellingPrice: p.sellingPrice ?? '',
  costPrice: p.costPrice ?? '',
  reorderLevel: p.reorderLevel ?? 0,
  openingStock: 0,
});

// Mirrors ProductRequest validation on the backend.
export function validateProduct(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Name is required';
  if (!v.categoryId) e.categoryId = 'Choose a category';
  if (!(Number(v.sellingPrice) >= 0.01)) e.sellingPrice = 'Price must be at least 0.01';
  if (v.costPrice !== '' && Number(v.costPrice) < 0) e.costPrice = 'Cannot be negative';
  if (!(Number(v.reorderLevel) >= 0)) e.reorderLevel = 'Cannot be negative';
  if (!(Number(v.openingStock) >= 0)) e.openingStock = 'Cannot be negative';
  return e;
}

export const toPayload = (v) => ({
  name: v.name.trim(),
  barcode: v.barcode.trim() || null,
  categoryId: Number(v.categoryId),
  unit: v.unit.trim() || null,
  sellingPrice: Number(v.sellingPrice),
  costPrice: v.costPrice === '' ? null : Number(v.costPrice),
  reorderLevel: Number(v.reorderLevel) || 0,
  openingStock: Number(v.openingStock) || 0,
});
