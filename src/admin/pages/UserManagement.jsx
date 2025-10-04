import React from "react";
import AdminHeader from "../../components/admin/AdminHeader";

const UserManagement = () => {
  return (
   <div className="min-h-screen bg-white">
      <AdminHeader />
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black avant mb-2">
            User Management
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
