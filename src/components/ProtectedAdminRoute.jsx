import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children, requiredPage }) => {
  const navigate = useNavigate();
  
  // Use admin-specific localStorage keys
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const token = localStorage.getItem('adminAuthToken');

  useEffect(() => {
    if (!token || !user.user_id) {
      navigate('/', { replace: true });
    }
  }, [navigate, token, user.user_id]);

  if (!token || !user.user_id) {
    return null;
  }

  const hasAccess = user.can_access?.includes(requiredPage);

  return React.cloneElement(children, { hasAccess, requiredPage });
};

export default ProtectedAdminRoute;
