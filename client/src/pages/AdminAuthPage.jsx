import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

export default function AdminAuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isNewAdmin, setIsNewAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);

  const checkEmail = async (emailValue) => {
    if (!emailValue.trim()) {
      setEmailChecked(false);
      return;
    }

    try {
      const response = await axios.post('/api/admin-auth/check-email', { email: emailValue });
      setIsNewAdmin(!response.data.exists);
      setEmailChecked(true);
      setError('');
    } catch (err) {
      setError('Error checking email');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailChecked(false);
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      checkEmail(email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailChecked) {
      setError('Please verify your email first');
      return;
    }

    if (isNewAdmin && password !== rePassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isNewAdmin ? '/api/admin-auth/register' : '/api/admin-auth/login';
      const response = await axios.post(endpoint, { email, password });

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminId', response.data.adminId);

      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Food Street
        </h1>
        <p className="text-center text-gray-600 mb-8">Admin Login</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {emailChecked && (
              <p className="text-sm text-green-600 mt-1">
                {isNewAdmin ? '✓ New admin - Register' : '✓ Existing admin - Login'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {isNewAdmin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Re-enter Password
              </label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !emailChecked}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing...' : isNewAdmin ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
