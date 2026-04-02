import { Navigate } from 'react-router-dom';

export default function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" replace />;
}
