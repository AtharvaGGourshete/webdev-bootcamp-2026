import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-xl font-semibold text-indigo-600">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Pending Staff  */}
      <h2 className="text-xl font-semibold mb-4">Pending Staff Approval</h2>
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

      {/* Products Section */}
      <div className="flex justify-between items-center mb-4">
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
              { label: "Category", name: "category" },
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

      {/* Stats Section */}
      <div className="grid grid-cols-1 pt-10 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value={stats.total_products} />
        <StatCard title="Low Stock Items" value={stats.low_stock} />
        <StatCard title="Items Sold" value={stats.total_sales} />
        <StatCard title="Total Revenue" value={`₹${stats.total_revenue.toFixed(2)}`} />
      </div>

    </div>
  );
};

export default AdminDashboard;