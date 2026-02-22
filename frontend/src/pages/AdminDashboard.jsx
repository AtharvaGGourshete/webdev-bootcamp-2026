import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [reports, setReports] = useState({ by_product: {}, by_category: {} });
  const [stats, setStats] = useState({ total_products: 0, total_sales: 0, total_revenue: 0, low_stock: 0 });
  const [formData, setFormData] = useState({
    name: "", category: "", price: "", quantity: "",
    description: "", img: "", restock: 5, status: "active", addedby: 1
  });

  const token = localStorage.getItem("token");
  const lowStockProducts = products.filter(p => p.quantity <= p.restock);

  useEffect(() => {
    fetchPendingStaff();
    fetchProducts();
    fetchStats();
    fetchReports();
    fetchCategories();
  }, []);

  const fetchPendingStaff = async () => {
    const res = await fetch(`${BACKEND_URL}/users/unverified`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setPendingStaff(await res.json());
  };

  const approveStaff = async (id) => {
    await fetch(`${BACKEND_URL}/users/verify/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    fetchPendingStaff();
  };

  const fetchProducts = async () => {
    const res = await fetch(`${BACKEND_URL}/products`);
    if (res.ok) { const data = await res.json(); setProducts(data.items); }
  };

  const fetchStats = async () => {
    const res = await fetch(`${BACKEND_URL}/stats`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  };

  const fetchReports = async () => {
    const res = await fetch(`${BACKEND_URL}/reports`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setReports(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch(`${BACKEND_URL}/categories`);
    if (res.ok) setCategories(await res.json());
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `${BACKEND_URL}/products/${editingProduct.id}` : `${BACKEND_URL}/products`;
    const method = editingProduct ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) }),
    });
    if (res.ok) {
      alert(editingProduct ? "Product updated!" : "Product added!");
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: "", category: "", price: "", quantity: "", description: "", img: "", restock: 5, status: "active", addedby: 1 });
      fetchProducts();
      fetchStats();
    } else alert("Something went wrong");
  };

  const handleEdit = (product) => { setEditingProduct(product); setFormData(product); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${BACKEND_URL}/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchProducts();
    fetchStats();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newCategory }),
    });
    if (res.ok) { setNewCategory(""); fetchCategories(); }
    else { const data = await res.json(); alert(data.detail); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await fetch(`${BACKEND_URL}/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchCategories();
  };

  const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-bg)' };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--color-bg)' }}>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-6">
        {[
          { title: "Total Products", value: stats.total_products },
          { title: "Low Stock Items", value: stats.low_stock },
          { title: "Items Sold", value: stats.total_sales },
          { title: "Total Revenue", value: `₹${stats.total_revenue.toFixed(2)}` },
        ].map(({ title, value }) => (
          <div key={title} className="bg-white p-6 rounded-2xl" style={{ border: '1px solid var(--color-border)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--color-muted)' }}>{title}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-2xl mb-8" style={{ border: '1px solid var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Low Stock Alerts</h2>
        {lowStockProducts.length === 0
          ? <p style={{ color: 'var(--color-muted)' }}>All items are well stocked.</p>
          : lowStockProducts.map(p => (
            <div key={p.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text)' }}>{p.name}</p>
              <span className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{p.quantity} left</span>
            </div>
          ))}
      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[
          { title: "Revenue by Category", data: reports.by_category },
          { title: "Revenue by Product", data: reports.by_product },
        ].map(({ title, data }) => (
          <div key={title} className="bg-white p-6 rounded-2xl" style={{ border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>{title}</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Sold</th>
                  <th className="text-left px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([name, d]) => (
                  <tr key={name} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td className="px-4 py-3 capitalize">{name}</td>
                    <td className="px-4 py-3">{d.quantity}</td>
                    <td className="px-4 py-3">₹{d.revenue.toFixed(2)}</td>
                  </tr>
                ))}
                {Object.keys(data).length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6" style={{ color: 'var(--color-muted)' }}>No sales yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Products</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingProduct(null); }}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: 'var(--color-primary)' }}>
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl mb-6" style={{ border: '1px solid var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: "Name", name: "name" },
              { label: "Price", name: "price", type: "number" },
              { label: "Quantity", name: "quantity", type: "number" },
              { label: "Image URL", name: "img" },
              { label: "Supplier ID", name: "addedby", type: "number" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>{label}</label>
                <input type={type} name={name} value={formData[name]} onChange={handleChange} required
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
                <option value="">-- Select category --</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>

            <div className="col-span-2">
              <button type="submit" className="w-full py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ background: 'var(--color-primary)' }}>
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Qty</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.quantity}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 rounded-lg text-white text-xs font-medium"
                    style={{ background: 'var(--color-accent)' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 rounded-lg text-white text-xs font-medium"
                    style={{ background: 'var(--color-danger)' }}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6" style={{ color: 'var(--color-muted)' }}>No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-2xl mb-8" style={{ border: '1px solid var(--color-border)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Categories</h2>
        <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name" required
            className="px-3 py-2 rounded-lg text-sm outline-none w-64" style={inputStyle} />
          <button type="submit" className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: 'var(--color-primary)' }}>+ Add</button>
        </form>
        {categories.length === 0
          ? <p style={{ color: 'var(--color-muted)' }}>No categories yet.</p>
          : <div className="flex flex-wrap gap-3">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text)' }}>{c.name}</span>
                <button onClick={() => handleDeleteCategory(c.id)} className="font-bold"
                  style={{ color: 'var(--color-danger)' }}>✕</button>
              </div>
            ))}
          </div>}
      </div>

      {/* Pending Staff */}
      <div className="bg-white p-6 rounded-2xl" style={{ border: '1px solid var(--color-border)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Pending Staff Approval</h2>
        {pendingStaff.length === 0
          ? <p style={{ color: 'var(--color-muted)' }}>No staff pending approval.</p>
          : pendingStaff.map(staff => (
            <div key={staff.id} className="flex justify-between items-center py-3"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>{staff.first_name} {staff.last_name}</p>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{staff.email_id}</p>
              </div>
              <button onClick={() => approveStaff(staff.id)}
                className="px-4 py-1.5 rounded-lg text-white text-sm font-medium"
                style={{ background: 'var(--color-success)' }}>Approve</button>
            </div>
          ))}
      </div>

    </div>
  );
};

export default AdminDashboard;