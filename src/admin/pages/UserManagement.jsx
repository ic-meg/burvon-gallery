import React, { useState, useMemo } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

import {
  NextIConBlack,
  PrevIConBlack,  
  DropDownIconBlack,
  DropUpIconBlack,
} from '../../assets/index.js';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'Active',
    pageAccess: {
      orderManagement: false,
      productManagement: false,
      userManagement: false,
      collectionsManagement: false,
      liveChat: false,
      content: false
    }
  });
  const [editUser, setEditUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'Active',
    pageAccess: {
      orderManagement: false,
      productManagement: false,
      userManagement: false,
      collectionsManagement: false,
      liveChat: false,
      content: false
    }
  });

  const itemsPerPage = 10;

  // Sample users data - Removed Support Staff and Department
  const [allUsers, setAllUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      password: "admin123",
      role: "Admin",
      status: "Active",
      dateCreated: "2024-08-15",
      lastLogin: "Oct 5, 2024 at 9:30 AM",
      pageAccess: {
        orderManagement: true,
        productManagement: true,
        userManagement: true,
        collectionsManagement: true,
        liveChat: true,
        content: true
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      password: "csr456",
      role: "CSR",
      status: "Active",
      dateCreated: "2024-07-20",
      lastLogin: "Oct 5, 2024 at 2:15 PM",
      pageAccess: {
        orderManagement: true,
        productManagement: false,
        userManagement: false,
        collectionsManagement: false,
        liveChat: true,
        content: false
      }
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      password: "clerk789",
      role: "Clerk",
      status: "Active",
      dateCreated: "2024-09-01",
      lastLogin: "Oct 4, 2024 at 4:45 PM",
      pageAccess: {
        orderManagement: true,
        productManagement: true,
        userManagement: false,
        collectionsManagement: true,
        liveChat: false,
        content: false
      }
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      password: "manager321",
      role: "Manager",
      status: "Active",
      dateCreated: "2024-06-10",
      lastLogin: "Oct 5, 2024 at 11:20 AM",
      pageAccess: {
        orderManagement: true,
        productManagement: true,
        userManagement: false,
        collectionsManagement: true,
        liveChat: true,
        content: true
      }
    }
  ]);

  // User role options - Removed Support Staff
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'csr', label: 'CSR' },
    { value: 'clerk', label: 'Clerk' }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  // Available page options for access control
  const pageOptions = [
    { key: 'orderManagement', label: 'Order Management' },
    { key: 'productManagement', label: 'Product Management' },
    { key: 'userManagement', label: 'User Management' },
    { key: 'collectionsManagement', label: 'Collections Management' },
    { key: 'liveChat', label: 'Live Chat' },
    { key: 'content', label: 'Content Management' }
  ];

  // Helper function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowRoleDropdown(false);
    setShowStatusDropdown(false);
  };

  // Handle user form changes for add user
  const handleUserChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle page access change for add user
  const handlePageAccessChange = (pageKey, checked) => {
    setNewUser(prev => ({
      ...prev,
      pageAccess: {
        ...prev.pageAccess,
        [pageKey]: checked
      }
    }));
  };

  // Handle user form changes for edit user
  const handleEditUserChange = (field, value) => {
    setEditUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle page access change for edit user
  const handleEditPageAccessChange = (pageKey, checked) => {
    setEditUser(prev => ({
      ...prev,
      pageAccess: {
        ...prev.pageAccess,
        [pageKey]: checked
      }
    }));
  };

  // Handle add user
  const handleAddUser = () => {
    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })} at ${currentDateTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })}`;

    const newUserData = {
      ...newUser,
      id: Date.now(),
      dateCreated: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    
    setAllUsers(prev => [...prev, newUserData]);
    console.log('Adding user:', newUserData);
    
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: '',
      status: 'Active',
      pageAccess: {
        orderManagement: false,
        productManagement: false,
        userManagement: false,
        collectionsManagement: false,
        liveChat: false,
        content: false
      }
    });
  };

  // Handle edit user button click
  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      status: user.status,
      pageAccess: user.pageAccess || {
        orderManagement: false,
        productManagement: false,
        userManagement: false,
        collectionsManagement: false,
        liveChat: false,
        content: false
      }
    });
    setShowEditUserModal(true);
  };

  // Handle update user
  const handleUpdateUser = () => {
    setAllUsers(prev => 
      prev.map(user => 
        user.id === editUser.id 
          ? { 
              ...user, 
              ...editUser,
              password: editUser.password || user.password
            }
          : user
      )
    );
    
    console.log('Updating user:', editUser);
    setShowEditUserModal(false);
    setEditUser({
      id: null,
      name: '',
      email: '',
      password: '',
      role: '',
      status: 'Active',
      pageAccess: {
        orderManagement: false,
        productManagement: false,
        userManagement: false,
        collectionsManagement: false,
        liveChat: false,
        content: false
      }
    });
  };

  // Handle remove user
  const handleRemoveUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      setAllUsers(prev => prev.filter(user => user.id !== userId));
      console.log('Removing user with ID:', userId);
    }
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => 
        user.role.toLowerCase() === selectedRole.toLowerCase()
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => 
        user.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allUsers, selectedRole, selectedStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedRole, selectedStatus, searchQuery]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-green-500 text-white',
      'Inactive': 'bg-yellow-500 text-white',
      'Suspended': 'bg-red-500 text-white'
    };

    return (
      <span className={`px-3 py-1 rounded text-xs avantbold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Get role badge styling
  const getRoleBadge = (role) => {
    const roleStyles = {
      'Admin': 'bg-purple-500 text-white',
      'Manager': 'bg-blue-500 text-white',
      'CSR': 'bg-green-500 text-white',
      'Clerk': 'bg-orange-500 text-white'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs avant font-medium ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header with Search */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">
              USER MANAGEMENT
            </h1>
            
            {/* Search Bar aligned with header */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Users, Roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-black"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Role Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowRoleDropdown(!showRoleDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-40"
                >
                  <span className="text-black">{roleOptions.find(role => role.value === selectedRole)?.label}</span>
                  <img
                    src={showRoleDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showRoleDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {roleOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedRole(option.value);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedRole === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === roleOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedRole !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRole !== option.value) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-40"
                >
                  <span className="text-black">{statusOptions.find(status => status.value === selectedStatus)?.label}</span>
                  <img
                    src={showStatusDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    {statusOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedStatus(option.value);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors text-black ${
                          selectedStatus === option.value ? "bg-gray-100 font-medium" : ""
                        } ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === statusOptions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        onMouseEnter={(e) => {
                          if (selectedStatus !== option.value) {
                            e.target.style.backgroundColor = '#959595';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedStatus !== option.value) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                          }
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add New User Button */}
            <div>
              <button 
                onClick={() => setShowAddUserModal(true)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avantbold uppercase text-sm font-medium"
              >
                Add New User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Users Table */}
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="p-6">
              {/* Table Header - Better spaced columns */}
              <div className="grid gap-6 mb-4 pb-4 border-b border-gray-200" style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 1.5fr' }}>
                <div className="text-sm avantbold text-gray-600">NAME</div>
                <div className="text-sm avantbold text-gray-600">EMAIL</div>
                <div className="text-sm avantbold text-gray-600">ROLE</div>
                <div className="text-sm avantbold text-gray-600">STATUS</div>
                <div className="text-sm avantbold text-gray-600">LAST LOGIN</div>
                <div className="text-sm avantbold text-gray-600 text-center">ACTIONS</div>
              </div>

              {/* Table Body - Better spaced columns */}
              <div className="space-y-4 mb-6">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="grid gap-6 items-center p-4 bg-gray-50 rounded-lg" style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 1.5fr' }}>
                    <div className="avantbold text-sm text-black">{user.name}</div>
                    <div className="avant text-sm text-gray-600">{user.email}</div>
                    <div>{getRoleBadge(user.role)}</div>
                    <div>{getStatusBadge(user.status)}</div>
                    <div className="avant text-sm text-gray-600">{user.lastLogin}</div>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="px-3 py-1 bg-transparent border border-black text-black rounded text-xs avant font-medium hover:bg-black hover:text-white transition-colors"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => handleRemoveUser(user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs avant font-medium hover:bg-red-700 transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center">
                  <div
                    className="inline-flex items-stretch border border-black rounded-full overflow-hidden bg-white"
                    style={{ height: 44 }}
                  >
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous Page"
                      className="flex items-center justify-center border-r border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        width: 44,
                        height: 44,
                        borderTopLeftRadius: 22,
                        borderBottomLeftRadius: 22,
                      }}
                    >
                      <img src={PrevIConBlack} alt="Prev" className="w-5 h-5" />
                    </button>
                    <div
                      className="flex items-center justify-center text-black avantbold font-bold text-base select-none whitespace-nowrap px-6"
                      style={{
                        letterSpacing: 2,
                        height: 44,
                      }}
                    >
                      {currentPage} OF {totalPages}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next Page"
                      className="flex items-center justify-center border-l border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        width: 44,
                        height: 44,
                        borderTopRightRadius: 22,
                        borderBottomRightRadius: 22,
                      }}
                    >
                      <img src={NextIConBlack} alt="Next" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add New User Modal - Removed Department field */}
      {showAddUserModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Add New User</h2>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">FULL NAME</label>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={newUser.name}
                    onChange={(e) => handleUserChange('name', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm avantbold text-black mb-2">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={newUser.email}
                    onChange={(e) => handleUserChange('email', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">PASSWORD</label>
                  <input
                    type="text"
                    placeholder="Enter Password"
                    value={newUser.password}
                    onChange={(e) => handleUserChange('password', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm avantbold text-black mb-2">USER ROLE</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => handleUserChange('role', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="CSR">CSR</option>
                    <option value="Clerk">Clerk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">STATUS</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => handleUserChange('status', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-3">PAGE ACCESS PERMISSIONS</label>
                <div className="grid grid-cols-3 gap-3">
                  {pageOptions.map(page => (
                    <label key={page.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newUser.pageAccess[page.key]}
                        onChange={(e) => handlePageAccessChange(page.key, e.target.checked)}
                        className="w-4 h-4 text-black border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-sm avant text-black">{page.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  ADD USER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Removed Department field */}
      {showEditUserModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Edit User</h2>
              <button 
                onClick={() => setShowEditUserModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">FULL NAME</label>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={editUser.name}
                    onChange={(e) => handleEditUserChange('name', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm avantbold text-black mb-2">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={editUser.email}
                    onChange={(e) => handleEditUserChange('email', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">PASSWORD</label>
                  <input
                    type="text"
                    placeholder="Enter Password"
                    value={editUser.password}
                    onChange={(e) => handleEditUserChange('password', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password is visible for recovery purposes</p>
                </div>

                <div>
                  <label className="block text-sm avantbold text-black mb-2">USER ROLE</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => handleEditUserChange('role', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="CSR">CSR</option>
                    <option value="Clerk">Clerk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm avantbold text-black mb-2">STATUS</label>
                  <select
                    value={editUser.status}
                    onChange={(e) => handleEditUserChange('status', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-3">PAGE ACCESS PERMISSIONS</label>
                <div className="grid grid-cols-3 gap-3">
                  {pageOptions.map(page => (
                    <label key={page.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editUser.pageAccess[page.key]}
                        onChange={(e) => handleEditPageAccessChange(page.key, e.target.checked)}
                        className="w-4 h-4 text-black border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-sm avant text-black">{page.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowEditUserModal(false)}
                  className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  UPDATE USER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
