import React, { useState, useMemo, useEffect } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

import {
  NextIConBlack,
  PrevIConBlack,  
  DropDownIconBlack,
  DropUpIconBlack,
} from '../../assets/index.js';

const UserManagement = ({ hasAccess = true }) => {
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: '',
    status: 'active',
    can_access: []
  });
  const [editUser, setEditUser] = useState({
    user_id: null,
    full_name: '',
    email: '',
    role: '',
    status: 'active',
    can_access: []
  });
  const [allUsers, setAllUsers] = useState([]);

  const itemsPerPage = 10;

  
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'csr', label: 'CSR' },
    { value: 'clerk', label: 'Clerk' }
  ];

  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  
  const pageOptions = [
    { key: 'Order Management', label: 'Order Management' },
    { key: 'Product Management', label: 'Product Management' },
    { key: 'User Management', label: 'User Management' },
    { key: 'Collections Management', label: 'Collections Management' },
    { key: 'Live Chat', label: 'Live Chat' },
    { key: 'Content Management', label: 'Content Management' }
  ];

 
  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/user/admin/all`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (response.ok) {
        const transformedUsers = data
          .filter(user => user.role !== 'customer')
          .map(user => ({
            ...user,
            created_at: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
          }));
        setAllUsers(transformedUsers);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  const closeAllDropdowns = () => {
    setShowRoleDropdown(false);
    setShowStatusDropdown(false);
  };


  const handleUserChange = (field, value) => {
    if (field === 'role') {
      setNewUser(prev => ({
        ...prev,
        [field]: value,
        can_access: value === 'super_admin' 
          ? pageOptions.map(p => p.key)
          : []
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

 
  const handlePageAccessChange = (pageKey, checked) => {
    setNewUser(prev => ({
      ...prev,
      can_access: checked 
        ? [...prev.can_access, pageKey]
        : prev.can_access.filter(p => p !== pageKey)
    }));
  };

 
  const handleEditUserChange = (field, value) => {
    if (field === 'role') {
      setEditUser(prev => ({
        ...prev,
        [field]: value,
        can_access: value === 'super_admin' 
          ? pageOptions.map(p => p.key)
          : []
      }));
    } else {
      setEditUser(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };


  const handleEditPageAccessChange = (pageKey, checked) => {
    setEditUser(prev => ({
      ...prev,
      can_access: checked 
        ? [...prev.can_access, pageKey]
        : prev.can_access.filter(p => p !== pageKey)
    }));
  };


  const handleAddUser = async () => {
    if (!newUser.full_name || !newUser.email || !newUser.role) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/user/admin/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (response.ok) {

        setGeneratedPassword(data.generated_password);
      
        await fetchUsers();
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Error creating user: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user button click
  const handleEditClick = (user) => {
    setEditUser({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      can_access: user.can_access || []
    });
    setShowEditUserModal(true);
  };

  // Handle update user
  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/user/admin/update/${editUser.user_id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          full_name: editUser.full_name,
          email: editUser.email,
          role: editUser.role,
          status: editUser.status,
          can_access: editUser.can_access
        })
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUsers();
        setShowEditUserModal(false);
        setEditUser({
          user_id: null,
          full_name: '',
          email: '',
          role: '',
          status: 'active',
          can_access: []
        });
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Error updating user: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle remove user
  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/user/admin/delete/${userId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
          // Refresh users list
          await fetchUsers();
        } else {
          setError(data.message || 'Failed to delete user');
        }
      } catch (err) {
        setError('Error deleting user: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
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
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      'active': 'bg-green-500 text-white',
      'inactive': 'bg-yellow-500 text-white',
      'suspended': 'bg-red-500 text-white'
    };

    return (
      <span className={`px-3 py-1 rounded text-xs avantbold capitalize ${statusStyles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Get role badge styling
  const getRoleBadge = (role) => {
    const roleStyles = {
      'super_admin': 'bg-indigo-600 text-white',
      'admin': 'bg-purple-500 text-white',
      'manager': 'bg-blue-500 text-white',
      'csr': 'bg-green-500 text-white',
      'clerk': 'bg-orange-500 text-white'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs avant font-medium capitalize ${roleStyles[role?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Error Alert */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg z-50 animate-pulse">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      {/* Generated Password Alert */}
      {generatedPassword && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg z-50 max-w-md">
          <div className="font-bold mb-2">User Created Successfully!</div>
          <div className="text-sm">Password: <span className="font-mono font-bold">{generatedPassword}</span></div>
          <div className="text-xs mt-2">Share this password with the user. It won't be shown again.</div>
        </div>
      )}

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
                disabled={!hasAccess}
                title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold uppercase text-sm font-medium"
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
                {loading ? (
                  <div className="text-center py-10">
                    <p className="text-lg avantbold text-gray-600">Loading users...</p>
                  </div>
                ) : paginatedUsers.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-lg avantbold text-gray-600">No users found.</p>
                  </div>
                ) : (
                  paginatedUsers.map((user) => (
                  <div key={user.user_id} className="grid gap-6 items-center p-4 bg-gray-50 rounded-lg" style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 1.5fr' }}>
                    <div className="avantbold text-sm text-black">{user.full_name}</div>
                    <div className="avant text-sm text-gray-600">{user.email}</div>
                    <div>{getRoleBadge(user.role)}</div>
                    <div>{getStatusBadge(user.status)}</div>
                    <div className="avant text-sm text-gray-600">{user.created_at}</div>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        disabled={!hasAccess}
                        title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                        className="px-3 py-1 bg-transparent border border-black text-black rounded text-xs avant font-medium hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => handleRemoveUser(user.user_id)}
                        disabled={!hasAccess}
                        title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs avant font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))
                )}
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
              <h2 className="text-xl avantbold text-black">
                {generatedPassword ? 'User Created Successfully!' : 'Add New User'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddUserModal(false);
                  setGeneratedPassword(null);
                }}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {generatedPassword ? (
                // Success screen showing generated password
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                    <p className="text-green-700 avantbold mb-4">✅ User account has been created successfully!</p>
                    
                    <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">Share this password with the user. It will NOT be shown again:</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={generatedPassword}
                          readOnly
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-mono font-bold text-lg text-black bg-gray-100"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPassword);
                            alert('Password copied to clipboard!');
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition avant text-sm font-medium"
                        >
                          COPY
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <p className="text-xs text-yellow-700">
                        ⚠️ <strong>Important:</strong> This password is temporary and for first login only. The user should change it on their first login.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAddUserModal(false);
                        setGeneratedPassword(null);
                        setNewUser({
                          full_name: '',
                          email: '',
                          role: '',
                          status: 'active',
                          can_access: []
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              ) : (
                // Add user form
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm avantbold text-black mb-2">FULL NAME</label>
                      <input
                        type="text"
                        placeholder="Enter Full Name"
                        value={newUser.full_name}
                        onChange={(e) => handleUserChange('full_name', e.target.value)}
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
                      <label className="block text-sm avantbold text-black mb-2">USER ROLE</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => handleUserChange('role', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                      >
                        <option value="">Select Role</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="csr">CSR</option>
                        <option value="clerk">Clerk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm avantbold text-black mb-2">STATUS</label>
                      <select
                        value={newUser.status}
                        onChange={(e) => handleUserChange('status', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm avantbold text-black mb-3">PAGE ACCESS PERMISSIONS</label>
                    <div className="grid grid-cols-3 gap-3">
                      {pageOptions.map(page => (
                        <label key={page.key} className={`flex items-center space-x-2 ${newUser.role === 'super_admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={newUser.can_access.includes(page.key)}
                            onChange={(e) => handlePageAccessChange(page.key, e.target.checked)}
                            disabled={newUser.role === 'super_admin'}
                            className={`w-4 h-4 text-black border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 ${newUser.role === 'super_admin' ? 'opacity-60' : ''}`}
                          />
                          <span className="text-sm avant text-black">{page.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className={`${newUser.role === 'super_admin' ? 'bg-purple-50 border-l-4 border-purple-400' : 'bg-blue-50 border-l-4 border-blue-400'} p-3 mt-3`}>
                      <p className={`text-xs ${newUser.role === 'super_admin' ? 'text-purple-700' : 'text-blue-700'}`}>
                        {newUser.role === 'super_admin' 
                          ? '👑 Super Admin has access to all pages automatically.'
                          : '✓ Password will be auto-generated and shown after user creation.'
                        }
                      </p>
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
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium disabled:opacity-50"
                    >
                      {loading ? 'CREATING...' : 'CREATE USER'}
                    </button>
                  </div>
                </>
              )}
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
                    value={editUser.full_name}
                    onChange={(e) => handleEditUserChange('full_name', e.target.value)}
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
                  <label className="block text-sm avantbold text-black mb-2">USER ROLE</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => handleEditUserChange('role', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="csr">CSR</option>
                    <option value="clerk">Clerk</option>
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-3">PAGE ACCESS PERMISSIONS</label>
                <div className="grid grid-cols-3 gap-3">
                  {pageOptions.map(page => (
                    <label key={page.key} className={`flex items-center space-x-2 ${editUser.role === 'super_admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={editUser.can_access.includes(page.key)}
                        onChange={(e) => handleEditPageAccessChange(page.key, e.target.checked)}
                        disabled={editUser.role === 'super_admin'}
                        className={`w-4 h-4 text-black border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 ${editUser.role === 'super_admin' ? 'opacity-60' : ''}`}
                      />
                      <span className="text-sm avant text-black">{page.label}</span>
                    </label>
                  ))}
                </div>

                {editUser.role === 'super_admin' && (
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-3 mt-3">
                    <p className="text-xs text-purple-700">
                      👑 <strong>Super Admin</strong> has access to all pages automatically.
                    </p>
                  </div>
                )}
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
