import ProductRow from './ProductRow';

export default function ProductTable({ products, canEdit = false, onEdit, onRemove }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Product</th><th>Category</th><th>Barcode</th>
            <th className="num">Price</th><th className="num">Stock</th><th className="num">Reorder at</th>
            {canEdit && <th />}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <ProductRow key={p.id} p={p} canEdit={canEdit} onEdit={onEdit} onRemove={onRemove} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
