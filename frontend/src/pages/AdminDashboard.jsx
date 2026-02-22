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
  const lowStockProducts = products.filter(p => p.quantity <= p.restock);

  const [stats, setStats] = useState({
    total_products: 0,
    total_sales: 0,
    total_revenue: 0,
    low_stock: 0
  });

  const [formData, setFormData] = useState({
    name: "", category: "", price: "", quantity: "",
    description: "", img: "", restock: 5, status: "active", addedby: 1
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingStaff();
    fetchProducts();
    fetchStats();
    fetchReports();
    fetchCategories();
  }, []);

  //Staff
  const fetchPendingStaff = async () => {
    const res = await fetch(`${BACKEND_URL}/users/unverified`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPendingStaff(await res.json());
  };

  const approveStaff = async (id) => {
    await fetch(`${BACKEND_URL}/users/verify/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPendingStaff();
  };

  //Products
  const fetchProducts = async () => {
    const res = await fetch(`${BACKEND_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.items);
    }
  };

  const fetchStats = async () => {
    const res = await fetch(`${BACKEND_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setStats(await res.json());
  };

  const fetchReports = async () => {
    const res = await fetch(`${BACKEND_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setReports(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch(`${BACKEND_URL}/categories`);
    if (res.ok) setCategories(await res.json());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingProduct
      ? `${BACKEND_URL}/products/${editingProduct.id}`
      : `${BACKEND_URL}/products`;

    const method = editingProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      }),
    });

    if (res.ok) {
      alert(editingProduct ? "Product updated!" : "Product added!");
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "", category: "", price: "", quantity: "",
        description: "", img: "", restock: 5, status: "active", addedby: 1
      });
      fetchProducts();
    } else {
      alert("Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${BACKEND_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });
    if (res.ok) {
      setNewCategory("");
      fetchCategories();
    } else {
      const data = await res.json();
      alert(data.detail);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await fetch(`${BACKEND_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
  };

  const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-xl font-semibold text-indigo-600">{value}</p>
    </div>
  );

  const AlertItem = ({ product, qty }) => (
    <div className="flex justify-between items-center border-b pb-2">
      <p className="text-gray-700">{product}</p>
      <span className="text-sm text-red-500 font-medium">{qty}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Stats Section */}
      <div className="grid grid-cols-1 pt-10 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value={stats.total_products} />
        <StatCard title="Low Stock Items" value={stats.low_stock} />
        <StatCard title="Items Sold" value={stats.total_sales} />
        <StatCard title="Total Revenue" value={`₹${stats.total_revenue.toFixed(2)}`} />
      </div>

      {/* Reports Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* By Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Items Sold</th>
                <th className="text-left px-4 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reports.by_category).map(([name, data]) => (
                <tr key={name} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 capitalize">{name}</td>
                  <td className="px-4 py-3">{data.quantity}</td>
                  <td className="px-4 py-3">₹{data.revenue.toFixed(2)}</td>
                </tr>
              ))}
              {Object.keys(reports.by_category).length === 0 && (
                <tr><td colSpan={3} className="text-center py-6 text-gray-400">No sales yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* By Product */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Revenue by Product</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Items Sold</th>
                <th className="text-left px-4 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reports.by_product).map(([name, data]) => (
                <tr key={name} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{name}</td>
                  <td className="px-4 py-3">{data.quantity}</td>
                  <td className="px-4 py-3">₹{data.revenue.toFixed(2)}</td>
                </tr>
              ))}
              {Object.keys(reports.by_product).length === 0 && (
                <tr><td colSpan={3} className="text-center py-6 text-gray-400">No sales yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Low Stock Alerts</h2>
        {lowStockProducts.length === 0 && <p className="text-gray-400">All items are well stocked.</p>}
        <div className="space-y-4">
          {lowStockProducts.map(p => (
            <AlertItem key={p.id} product={p.name} qty={`${p.quantity} left`} />
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingProduct(null); }}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-medium mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: "Name", name: "name" },
              { label: "Price", name: "price", type: "number" },
              { label: "Quantity", name: "quantity", type: "number" },
              { label: "Image URL", name: "img" },
              { label: "Supplier", name: "addedby", type: "number" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input type={type} name={name} value={formData[name]} onChange={handleChange} required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            ))}

            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">-- Select category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="col-span-2">
              <button type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Qty</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.quantity}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(p)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Categories Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
          />
          <button type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg">
            + Add Category
          </button>
        </form>

        {/* Categories List */}
        {categories.length === 0 && <p className="text-gray-400">No categories yet.</p>}
        <div className="flex flex-wrap gap-3">
          {categories.map(c => (
            <div key={c.id} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-gray-700 text-sm">{c.name}</span>
              <button onClick={() => handleDeleteCategory(c.id)}
                className="text-red-400 hover:text-red-600 text-xs font-bold">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Staff  */}
      <h2 className="text-xl mt-9 font-semibold mb-4">Pending Staff Approval</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm mb-10">
        {pendingStaff.length === 0 && <p>No staff pending approval.</p>}
        {pendingStaff.map((staff) => (
          <div key={staff.id} className="flex justify-between items-center border-b py-2">
            <div>
              <p>{staff.first_name} {staff.last_name}</p>
              <p className="text-sm text-gray-500">{staff.email_id}</p>
            </div>
            <button onClick={() => approveStaff(staff.id)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
              Approve
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;