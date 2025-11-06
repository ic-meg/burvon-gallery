import React from 'react';

const ProtectedAdminRoute = ({ children, requiredPage }) => {
  // Use admin-specific localStorage keys
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const token = localStorage.getItem('adminAuthToken');

  if (!token || !user.user_id) {
    return null;
  }

  const hasAccess = user.can_access?.includes(requiredPage);

  return React.cloneElement(children, { hasAccess, requiredPage });
};

export default ProtectedAdminRoute;
