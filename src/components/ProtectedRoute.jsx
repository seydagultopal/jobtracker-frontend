import { useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('checking');
  const [retryKey, setRetryKey] = useState(0);

  const checkSession = useCallback(async () => {
    setStatus('checking');

    try {
      await api.get('/api/users/me');
      setStatus('authenticated');
    } catch (error) {
      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        setStatus('unauthenticated');
      } else {
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const verify = async () => {
      setStatus('checking');

      try {
        await api.get('/api/users/me');
        if (active) setStatus('authenticated');
      } catch (error) {
        if (!active) return;

        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          setStatus('unauthenticated');
        } else {
          setStatus('error');
        }
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [retryKey]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500" role="status">
        Oturum kontrol ediliyor...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center text-gray-700 dark:text-gray-200">
        <p>Oturum doğrulanamadı. Sunucu bağlantısını kontrol edip tekrar deneyin.</p>
        <button
          type="button"
          onClick={() => setRetryKey((key) => key + 1)}
          className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  return children;
}
