import React from "react";

const StaffDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <StatCard title="Today's Sales" value="₹12,500" />
        <StatCard title="Items Sold Today" value="32" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-10">
        <h2 className="text-lg font-medium mb-6">Quick Actions</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <ActionButton label="+ Add Sale" color="green" />
          <ActionButton label="+ Add Purchase" color="blue" />
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
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
  </div>
);

const ActionButton = ({ label, color }) => {
  const styles = {
    green: "bg-green-500 hover:bg-green-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <button
      className={`text-white px-6 py-3 rounded-lg font-medium transition ${styles[color]}`}
    >
      {label}
    </button>
  );
};

const AlertItem = ({ product, qty }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <p className="text-gray-700">{product}</p>
    <span className="text-sm text-red-500 font-medium">{qty}</span>
  </div>
);

export default StaffDashboard;
