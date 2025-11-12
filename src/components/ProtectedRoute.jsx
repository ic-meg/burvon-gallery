import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getUser } from '../services/authService';
import { isAdminUser } from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    const user = getUser();

    if (!token || !user || !user.user_id) {
      navigate('/', { replace: true });
      return;
    }

    // Check if admin user is trying to access customer page - redirect to home
    if (isAdminUser(user)) {
      navigate('/', { replace: true });
      return;
    }

    // Check if admin user is logged in (in admin localStorage) - redirect to home
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
    if (adminUser && adminUser.user_id) {
      navigate('/', { replace: true });
      return;
    }
  }, [navigate]);

  const token = getAuthToken();
  const user = getUser();

  // If not authenticated, don't render children (redirect will happen)
  if (!token || !user || !user.user_id) {
    return null;
  }

  // If admin user, don't render (redirect will happen)
  if (isAdminUser(user)) {
    return null;
  }

  // If admin user is logged in, don't render (redirect will happen)
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  if (adminUser && adminUser.user_id) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

