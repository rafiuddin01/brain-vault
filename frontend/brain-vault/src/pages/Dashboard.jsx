/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import NotesTable from '../components/NotesTable';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [lastError, setLastError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // quick token check
        const token = localStorage.getItem('token');
        if (!token) {
          // no token -> go to login
          toast.info('Please login to continue');
          navigate('/login');
          return;
        }

        // safe decode of token payload
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            // decode payload, but guard exceptions
            const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(payloadJson);
            if (mounted) setUserEmail(payload.email || null);
          } else {
            // malformed token
            console.warn('Malformed JWT token detected', token);
          }
        } catch (err) {
          console.warn('Failed to parse token payload (non-fatal)', err);
        }

        // Try a quick authenticated call to ensure token is valid
        await api.get('/notes'); // NotesTable will fetch too; this just verifies auth
      } catch (err) {
        console.error('Auth check error (Dashboard):', err);
        setLastError(err);

        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          toast.error('Session expired — please login again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        // other errors: show a friendly message but don't block UI
        toast.error('Could not verify session — some features may not work. Check console for details.');
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    })();

    return () => { mounted = false; };
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    toast.success('Logged out');
    navigate('/login');
  }

  // Developer-friendly render of error (collapsed by default)
  const DebugPanel = () => (
    <details className="mt-4 text-xs text-slate-500">
      <summary className="cursor-pointer">Debug: show last error</summary>
      <pre className="bg-slate-100 p-3 rounded mt-2 text-xs overflow-auto max-h-48">
        {lastError ? (lastError.stack || JSON.stringify(lastError, Object.getOwnPropertyNames(lastError), 2)) : 'No errors logged.'}
      </pre>
    </details>
  );

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-medium">Checking session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              BV
            </div>
            <div>
              <h1 className="text-2xl font-semibold">BrainVault</h1>
              <p className="text-sm text-slate-500">
                {userEmail ? `Signed in as ${userEmail}` : 'Manage your notes and PDFs'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:shadow transition transform hover:-translate-y-0.5"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </motion.header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl shadow p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-sm text-slate-500">Create notes, upload PDFs, and manage your files</p>
          </div>

          {/* Notes table + modal */}
          <NotesTable />

          {/* Debug */}
          <DebugPanel />
        </motion.main>
      </div>
    </div>
  );
}
