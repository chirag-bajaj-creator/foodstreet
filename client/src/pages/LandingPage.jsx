import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

export default function LandingPage() {
  const navigate = useNavigate();
  useSessionTimeout(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const handleLogout = () => {
    setShowLogoutMessage(true);
    setTimeout(() => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      navigate('/auth');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {showLogoutMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg font-semibold z-50">
          ✅ Logged out successfully!
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Food Street</h1>
      </nav>

      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(/hero-image.png)',
          }}
        ></div>

        {/* Gradient Overlay - Warm Gold & Burgundy */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/65 via-orange-800/55 to-red-900/65"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
            Welcome to Food Street
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 sm:mb-12 drop-shadow-md">
            One Stop Food for Everybody
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate('/form')}
              className="bg-indigo-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-base sm:text-lg shadow-lg"
            >
              Fill Your Preferences
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition text-base sm:text-lg shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
