import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const StaffDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleData, setSaleData] = useState({ product_id: "", quantity_sold: "" });
  const [message, setMessage] = useState({ text: "", success: true });

  const token = localStorage.getItem("token");
  const lowStockProducts = products.filter(p => p.quantity <= p.restock);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${BACKEND_URL}/products`);
    if (res.ok) { const data = await res.json(); setProducts(data.items); }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        product_id: saleData.product_id,
        quantity_sold: parseInt(saleData.quantity_sold),
        sold_by: parseInt(localStorage.getItem("user_id")),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ text: "Sale recorded successfully!", success: true });
      setSaleData({ product_id: "", quantity_sold: "" });
      setShowSaleForm(false);
      fetchProducts();
    } else {
      setMessage({ text: data.detail, success: false });
    }
  };

  const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-bg)' };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--color-bg)' }}>

      {/* Message */}
      {message.text && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium"
          style={{
            background: message.success ? '#f0fdf4' : '#fef2f2',
            color: message.success ? 'var(--color-success)' : 'var(--color-danger)',
            border: `1px solid ${message.success ? '#bbf7d0' : '#fecaca'}`
          }}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-6">
        {[
          { title: "Total Products", value: products.length },
          { title: "Low Stock Items", value: lowStockProducts.length },
        ].map(({ title, value }) => (
          <div key={title} className="bg-white p-6 rounded-2xl" style={{ border: '1px solid var(--color-border)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--color-muted)' }}>{title}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add Sale */}
      <div className="bg-white p-6 rounded-2xl mb-8" style={{ border: '1px solid var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Quick Actions</h2>
        <button onClick={() => { setShowSaleForm(!showSaleForm); setMessage({ text: "", success: true }); }}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-medium"
          style={{ background: 'var(--color-primary)' }}>
          {showSaleForm ? "Cancel" : "+ Add Sale"}
        </button>

        {showSaleForm && (
          <form onSubmit={handleSaleSubmit} className="mt-6 space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Select Product</label>
              <select value={saleData.product_id}
                onChange={(e) => setSaleData({ ...saleData, product_id: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
                <option value="">-- Choose a product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Quantity</label>
              <input type="number" min="1" value={saleData.quantity_sold}
                onChange={(e) => setSaleData({ ...saleData, quantity_sold: e.target.value })} required
                placeholder="Enter quantity"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg text-white font-semibold text-sm"
              style={{ background: 'var(--color-primary)' }}>
              Record Sale
            </button>
          </form>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-2xl mb-8" style={{ border: '1px solid var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>All Products</h2>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.quantity}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: p.quantity <= p.restock ? '#fef2f2' : '#f0fdf4',
                      color: p.quantity <= p.restock ? 'var(--color-danger)' : 'var(--color-success)'
                    }}>
                    {p.quantity <= p.restock ? "Low Stock" : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6" style={{ color: 'var(--color-muted)' }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-2xl" style={{ border: '1px solid var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Low Stock Alerts</h2>
        {lowStockProducts.length === 0
          ? <p style={{ color: 'var(--color-muted)' }}>All items are well stocked.</p>
          : lowStockProducts.map(p => (
            <div key={p.id} className="flex justify-between items-center py-2"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text)' }}>{p.name}</p>
              <span className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{p.quantity} left</span>
            </div>
          ))}
      </div>

    </div>
  );
};

export default StaffDashboard;