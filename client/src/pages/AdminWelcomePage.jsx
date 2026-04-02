import { useNavigate } from 'react-router-dom';

export default function AdminWelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Food Street
        </h1>
        <p className="text-gray-600 text-lg mb-8">Admin Dashboard</p>
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}
