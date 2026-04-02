import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const useSessionTimeout = (isAdmin = false) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const activityRef = useRef(null);

  const logout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      navigate('/admin');
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      navigate('/auth');
    }
  };

  const resetTimeout = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
  };

  useEffect(() => {
    // Setup activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timeout
    resetTimeout();

    // Cleanup on page unload - logout user
    const handleBeforeUnload = () => {
      logout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAdmin]);
};
