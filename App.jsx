import React, { useEffect, useState } from 'react';
import './index.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category, image } = form;
    if (!name || !price || !category) return alert('All fields required');

    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:5000/api/products/${editId}`
      : 'http://localhost:5000/api/products';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ name: '', price: '', category: '', image: '' });
    setEditId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !filter || p.category === filter)
    .sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : 0);

  return (
    <div className="container">
      <h2>Product Catalog</h2>

      <form onSubmit={handleSubmit} className="form">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product Name" />
        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" />
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" />
        <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL" />
        <button type="submit">{editId ? 'Update' : 'Add'} Product</button>
      </form>

      <div className="filters">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
        <select onChange={e => setFilter(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(products.map(p => p.category))].map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select onChange={e => setSort(e.target.value)}>
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {filtered.map(p => (
          <div key={p._id} className="product-card">
            {p.image && <img src={p.image} alt={p.name} />}
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <p>{p.category}</p>
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
