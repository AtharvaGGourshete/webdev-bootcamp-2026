import React, { useEffect, useState } from "react";

const StaffDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleData, setSaleData] = useState({ product_id: "", quantity_sold: "" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${BACKEND_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.items);
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BACKEND_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: saleData.product_id,
        quantity_sold: parseInt(saleData.quantity_sold),
        sold_by: parseInt(localStorage.getItem("user_id")),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Sale recorded successfully!");
      setSaleData({ product_id: "", quantity_sold: "" });
      setShowSaleForm(false);
      fetchProducts();
    } else {
      setMessage("" + data.detail);
    }
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.restock);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Message */}
      {message && (
        <div className="mb-4 p-3 bg-white border rounded-lg text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <StatCard title="Total Products" value={products.length} />
        <StatCard title="Low Stock Items" value={lowStockProducts.length} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-10">
        <h2 className="text-lg font-medium mb-6">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => { setShowSaleForm(!showSaleForm); setMessage(""); }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {showSaleForm ? "Cancel" : "+ Add Sale"}
          </button>
        </div>

        {/* Sale Form */}
        {showSaleForm && (
          <form onSubmit={handleSaleSubmit} className="mt-6 space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Product</label>
              <select
                value={saleData.product_id}
                onChange={(e) => setSaleData({ ...saleData, product_id: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Choose a product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={saleData.quantity_sold}
                onChange={(e) => setSaleData({ ...saleData, quantity_sold: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter quantity"
              />
            </div>

            <button type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium">
              Record Sale
            </button>
          </form>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6 mb-6">
        <h2 className="text-lg font-medium mb-4">All Products</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.quantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.quantity <= p.restock
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    }`}>
                    {p.quantity <= p.restock ? "Low Stock" : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-medium mb-4">Low Stock Alerts</h2>
        {lowStockProducts.length === 0 && <p className="text-gray-400">All items are well stocked.</p>}
        <div className="space-y-4">
          {lowStockProducts.map(p => (
            <AlertItem key={p.id} product={p.name} qty={`${p.quantity} left`} />
          ))}
        </div>
      </div>

    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
  </div>
);

const AlertItem = ({ product, qty }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <p className="text-gray-700">{product}</p>
    <span className="text-sm text-red-500 font-medium">{qty}</span>
  </div>
);

export default StaffDashboard;