import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import DataState from '../../components/ui/DataState';
import CategoryForm from './CategoryForm';
import useFetch from '../../hooks/useFetch';
import useAction from '../../hooks/useAction';
import { getCategories, deleteCategory } from '../../api/categories';

export default function CategoriesPage() {
  const { data, loading, error, reload } = useFetch(getCategories);
  const [editing, setEditing] = useState(null);
  const run = useAction(reload);
  const remove = (c) => run(() => deleteCategory(c.id), { confirm: `Delete ${c.name}?`, ok: 'Category deleted' });
  const saved = () => { setEditing(null); reload(); };
  return (
    <>
      <PageHeader title="Categories" subtitle="Group products so they are easy to find">
        <button className="btn" onClick={() => setEditing({})}>Add category</button>
      </PageHeader>
      <DataState loading={loading} error={error} empty={data?.length === 0}>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>#</th><th>Name</th><th /></tr></thead>
          <tbody>
            {(data || []).map((c) => (
              <tr key={c.id}>
                <td className="muted">{c.id}</td><td>{c.name}</td>
                <td className="actions">
                  <button className="link-btn" onClick={() => setEditing(c)}>Edit</button>
                  <button className="link-btn danger" onClick={() => remove(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </DataState>
      {editing && <CategoryForm category={editing} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}
