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

  return (
    <div className="min-h-screen p-6 bg-slate-50">

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.success ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-6">
        {[
          { title: "Total Products", value: products.length },
          { title: "Low Stock Items", value: lowStockProducts.length },
        ].map(({ title, value }) => (
          <div key={title} className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-sm mb-1 text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-teal-700">{value}</p>
          </div>
        ))}
      </div>

      {/* Add Sale */}
      <div className="bg-white p-6 rounded-2xl mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Quick Actions</h2>
        <button onClick={() => { setShowSaleForm(!showSaleForm); setMessage({ text: "", success: true }); }}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-medium bg-teal-700 hover:bg-teal-800">
          {showSaleForm ? "Cancel" : "+ Add Sale"}
        </button>

        {showSaleForm && (
          <form onSubmit={handleSaleSubmit} className="mt-6 space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Select Product</label>
              <select value={saleData.product_id}
                onChange={(e) => setSaleData({ ...saleData, product_id: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50">
                <option value="">-- Choose a product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Quantity</label>
              <input type="number" min="1" value={saleData.quantity_sold}
                onChange={(e) => setSaleData({ ...saleData, quantity_sold: e.target.value })} required
                placeholder="Enter quantity"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg text-white font-semibold text-sm bg-teal-700 hover:bg-teal-800">
              Record Sale
            </button>
          </form>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-2xl mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">All Products</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.quantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.quantity <= p.restock ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {p.quantity <= p.restock ? "Low Stock" : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6 text-slate-400">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Low Stock Alerts</h2>
        {lowStockProducts.length === 0
          ? <p className="text-slate-500">All items are well stocked.</p>
          : lowStockProducts.map(p => (
            <div key={p.id} className="flex justify-between items-center py-2 border-b border-slate-100">
              <p className="text-slate-800">{p.name}</p>
              <span className="text-sm font-medium text-red-500">{p.quantity} left</span>
            </div>
          ))}
      </div>

    </div>
  );
};

export default StaffDashboard;