import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('userToken');
  return token ? children : <Navigate to="/auth" replace />;
}
