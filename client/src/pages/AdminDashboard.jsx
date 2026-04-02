import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  useSessionTimeout(true);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userResponse, setUserResponse] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedResponses, setExpandedResponses] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCities();

    // Setup Socket.io connection
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('new-submission', (data) => {
      console.log('New submission received:', data);
      // Refresh user list when a new submission arrives
      fetchUsers();
      fetchCities();
      // If currently viewing a user, refresh their response
      if (data.userId === selectedUser) {
        fetchUserResponse(selectedUser);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/responses/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/responses/cities');
      setCities(response.data);
    } catch (err) {
      console.error('Failed to load cities:', err);
    }
  };

  const fetchUserResponse = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/responses/user-history/${userId}`);
      setUserHistory(response.data);
      setUserResponse(response.data[0]); // Show latest by default
      setSelectedSubmissionIndex(0);
      setSelectedUser(userId);
      setError('');
    } catch (err) {
      setError('Failed to load user responses');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutMessage(true);
    setTimeout(() => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {showLogoutMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg font-semibold z-50">
          ✅ Logged out successfully!
        </div>
      )}

      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg flex flex-col h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Food Street</h1>
          <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => setExpandedResponses(!expandedResponses)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition flex justify-between items-center"
          >
            <span>Responses</span>
            <span>{expandedResponses ? '▼' : '▶'}</span>
          </button>

          {expandedResponses && (
            <div className="mt-4 border-t pt-4 space-y-4">
              {/* City Filter Dropdown */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Filter by City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* User List */}
              {users.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">No submissions yet</p>
              ) : (
                <div className="space-y-4">
                  {users
                    .filter(user => selectedCity === 'all' || user.city === selectedCity)
                    .map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => fetchUserResponse(user.userId)}
                        className={`w-full text-left px-4 py-6 rounded-lg transition text-sm ${
                          selectedUser === user.userId
                            ? 'bg-indigo-100 text-indigo-800 border-l-4 border-indigo-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="font-medium">{user.name || user.email}</div>
                        <div className="text-xs text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.city}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.submittedAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {selectedUser ? 'Inspection Response' : 'Select a user to view responses'}
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          )}

          {userResponse && !loading && (
            <div className="space-y-8">
              {/* Submission History Navigation */}
              {userHistory.length > 1 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-800 font-semibold mb-4">
                    Submission History ({userHistory.length} submissions)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userHistory.map((submission, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserResponse(submission);
                          setSelectedSubmissionIndex(idx);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          selectedSubmissionIndex === idx
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        #{userHistory.length - idx} - {new Date(submission.submittedAt).toLocaleDateString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow p-6">
                {userResponse.name && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Name:</span> {userResponse.name}
                  </p>
                )}
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Email:</span> {userResponse.email}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">City:</span> {userResponse.city}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Submitted At:</span>{' '}
                  {new Date(userResponse.submittedAt).toLocaleString()}
                </p>
              </div>

              {userResponse.responses.map((cardResponse, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-indigo-200">
                    {cardResponse.category}
                  </h3>

                  <div className="space-y-4">
                    {cardResponse.questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300"
                      >
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {qIndex + 1}. {q.question}
                          </p>
                        </div>
                        <div className="ml-4 min-w-[100px] text-right">
                          <span
                            className={`inline-block px-4 py-2 rounded-lg font-bold text-white ${
                              q.answer === 'Yes'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {q.answer}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!selectedUser && !loading && (
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">
                Click on a user in the sidebar to view their inspection responses
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
