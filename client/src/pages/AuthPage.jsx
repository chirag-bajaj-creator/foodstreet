import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);

  const checkEmail = async (emailValue) => {
    if (!emailValue.trim()) {
      setEmailChecked(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/check-email', { email: emailValue });
      setIsNewUser(!response.data.exists);
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

    if (isNewUser && !name.trim()) {
      setError('Name is required');
      return;
    }

    if (isNewUser && password !== rePassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isNewUser ? '/api/auth/register' : '/api/auth/login';
      const payload = isNewUser ? { email, password, name } : { email, password };
      const response = await axios.post(endpoint, payload);

      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userName', response.data.name);

      const message = isNewUser ? '✅ Registration successful! Welcome to Food Street!' : '✅ Login successful! Welcome back!';
      setSuccess(message);
      setError('');

      setTimeout(() => {
        navigate('/landing');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Food Street
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {emailChecked && (
              <p className="text-sm text-green-600 mt-1">
                {isNewUser ? '✓ New user - Register' : '✓ Existing user - Login'}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {isNewUser && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-semibold">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !emailChecked}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing...' : isNewUser ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
