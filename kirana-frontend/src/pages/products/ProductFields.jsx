import Field from '../../components/ui/Field';

export default function ProductFields({ bind, errors, categories, isNew }) {
  return (
    <>
      <Field label="Product name" error={errors.name} full><input className="input" {...bind('name')} /></Field>
      <Field label="Category" error={errors.categoryId}>
        <select className="input" {...bind('categoryId')}>
          <option value="">Select...</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Unit"><input className="input" placeholder="pcs, pack, kg" {...bind('unit')} /></Field>
      <Field label="Barcode (optional)"><input className="input" {...bind('barcode')} /></Field>
      <Field label="Reorder level" error={errors.reorderLevel}><input type="number" min="0" className="input" {...bind('reorderLevel')} /></Field>
      <Field label="Selling price" error={errors.sellingPrice}><input type="number" step="0.01" className="input" {...bind('sellingPrice')} /></Field>
      <Field label="Cost price" error={errors.costPrice}><input type="number" step="0.01" className="input" {...bind('costPrice')} /></Field>
      {isNew && <Field label="Opening stock" error={errors.openingStock}><input type="number" min="0" className="input" {...bind('openingStock')} /></Field>}
    </>
  );
}
