// Authentication utility functions

export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const isAdmin = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('adminToken');
};

export const requireAdmin = () => {
  if (!isAuthenticated()) {
    throw new Error('Authentication required');
  }
  if (!isAdmin()) {
    throw new Error('Admin privileges required');
  }
  return true;
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
