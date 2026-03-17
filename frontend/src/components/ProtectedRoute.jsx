import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — logged-in users only
 * Redirects to /login if no token found in localStorage
 */
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * AdminRoute — admin role only
 * Redirects to /login if not logged in, or to /dashboard if not admin
 */
export function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}
