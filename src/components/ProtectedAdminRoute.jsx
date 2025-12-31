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
  
  const isCSR = user.role === 'CSR' || (user.can_access && user.can_access.length === 1 && user.can_access.includes('Live Chat'));
  
  const isClerk = user.role === 'clerk' || (user.can_access && 
    user.can_access.length === 3 && 
    user.can_access.includes('Order Management') && 
    user.can_access.includes('Product Management') && 
    user.can_access.includes('Collections Management'));
  
  const isManager = user.role === 'manager';
  
  // Can only edit if user has access to the page AND meets role-specific edit criteria
  const canEdit = user.role === 'super_admin' || (
    hasAccess && (
      (isCSR && requiredPage === 'Live Chat') ||
      (isClerk && ['Order Management', 'Product Management', 'Collections Management'].includes(requiredPage)) ||
      (user.role === 'manager' && requiredPage !== 'User Management')
    )
  );

  return React.cloneElement(children, { hasAccess: true, requiredPage, isCSR, isClerk, isManager, canEdit });
};

export default ProtectedAdminRoute;
