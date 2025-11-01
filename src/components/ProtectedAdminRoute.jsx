import React from 'react';

const ProtectedAdminRoute = ({ children, requiredPage }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('authToken');

  if (!token || !user.user_id) {
    return null;
  }

  const hasAccess = user.can_access?.includes(requiredPage);

  return React.cloneElement(children, { hasAccess, requiredPage });
};

export default ProtectedAdminRoute;
