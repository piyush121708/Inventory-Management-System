import { useState } from 'react';

// Cart state for the billing screen. Prices always come from the product record.
export default function useCart() {
  const [lines, setLines] = useState([]);

  const add = (product) => setLines((cur) => {
    const found = cur.find((l) => l.product.id === product.id);
    if (!found) return [...cur, { product, quantity: 1 }];
    return cur.map((l) => (l === found ? { ...l, quantity: l.quantity + 1 } : l));
  });
  const setQty = (id, quantity) =>
    setLines((cur) => cur.map((l) => (l.product.id === id ? { ...l, quantity } : l)));
  const remove = (id) => setLines((cur) => cur.filter((l) => l.product.id !== id));
  const clear = () => setLines([]);
  const total = lines.reduce((sum, l) => sum + l.product.sellingPrice * l.quantity, 0);

  return { lines, add, setQty, remove, clear, total };
}
