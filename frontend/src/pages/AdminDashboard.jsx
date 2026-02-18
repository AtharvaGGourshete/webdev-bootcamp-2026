import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value="120" />
        <StatCard title="Low Stock Items" value="8" />
        <StatCard title="Total Sales" value="₹54,000" />
        <StatCard title="Revenue" value="₹1,20,000" />
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>

          <div className="space-y-4">
            <TransactionItem
              name="Keyboard"
              type="Sale"
              date="12 Feb 2026"
            />
            <TransactionItem
              name="Mouse"
              type="Purchase"
              date="11 Feb 2026"
            />
            <TransactionItem
              name="Monitor"
              type="Sale"
              date="10 Feb 2026"
            />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4">Low Stock Alerts</h2>

          <div className="space-y-4">
            <AlertItem product="Headphones" qty="3 left" />
            <AlertItem product="USB Cable" qty="5 left" />
            <AlertItem product="Webcam" qty="2 left" />
          </div>
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

const TransactionItem = ({ name, type, date }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <div>
      <p className="font-medium text-gray-700">{name}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    <span
      className={`text-sm px-3 py-1 rounded-full ${
        type === "Sale"
          ? "bg-green-100 text-green-600"
          : "bg-blue-100 text-blue-600"
      }`}
    >
      {type}
    </span>
  </div>
);

const AlertItem = ({ product, qty }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <p className="text-gray-700">{product}</p>
    <span className="text-sm text-red-500 font-medium">{qty}</span>
  </div>
);

export default AdminDashboard;
