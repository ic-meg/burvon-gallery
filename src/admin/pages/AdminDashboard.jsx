import React from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      
      {/* Dashboard Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black avant mb-2">
            Admin Dashboard
          </h1>
        </div>
      </div>
      
      {/* here you will code the dashboard */}

    </div>
  )
}

export default AdminDashboard
