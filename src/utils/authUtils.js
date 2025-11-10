
export const isAdminUser = (user) => {
  if (!user) return false;
  const adminRoles = ['super_admin', 'admin', 'manager', 'csr', 'clerk'];
  return adminRoles.includes(user.role);
};

export const isCustomerUser = (user) => {
  if (!user) return false;
  return user.role === 'customer';
};

export const checkAndRedirectAdmin = (user, navigate) => {
  if (!user) return false;
  
  // Check if user is logged in as admin in customer localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  
  if (isAdminUser(user)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin-login');
    return true;
  }
  
  if (adminUser && adminUser.user_id) {
    navigate('/admin/dashboard');
    return true;
  }
  
  return false;
};

