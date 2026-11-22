import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/products?search=${encodeURIComponent(q.trim())}` : '/products');
  };
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="brand">
          <div className="brand-mark">G</div><b>G-super</b><span>mart</span>
        </Link>
        <form className="search" onSubmit={submit}>
          <input placeholder="Search for products" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn">Search</button>
        </form>
        <div className="header-links">
          <Link className="header-link" to="/bills">Bills</Link>
          <Link className="header-link" to="/billing">New Bill</Link>
        </div>
      </div>
    </header>
  );
}
