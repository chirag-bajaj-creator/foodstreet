import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import AdminWelcomePage from './pages/AdminWelcomePage';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/landing" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
        <Route path="/form" element={<PrivateRoute><FormPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminWelcomePage />} />
        <Route path="/admin/login" element={<AdminAuthPage />} />
        <Route path="/admin-dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
