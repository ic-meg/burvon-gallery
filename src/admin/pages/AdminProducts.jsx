import React from "react";
import AdminHeder from "../../components/admin/AdminHeader";

const AdminProducts = () => {
  return (
    <div className="min-h-screen bg-white">
      <AdminHeder />

      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black avant mb-2">
            Product Management
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
