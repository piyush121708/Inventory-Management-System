import CartLine from './CartLine';

export default function CartTable({ cart }) {
  if (cart.lines.length === 0) return <p className="muted">The cart is empty. Add products from the left.</p>;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Item</th><th className="num">Price</th><th className="num">Qty</th><th className="num">Total</th><th /></tr></thead>
        <tbody>
          {cart.lines.map((l) => <CartLine key={l.product.id} line={l} onQty={cart.setQty} onRemove={cart.remove} />)}
        </tbody>
      </table>
    </div>
  );
}
