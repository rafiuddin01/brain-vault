/* eslint-disable no-unused-vars */
// src/components/NotesTable.jsx
import React, { useEffect, useState } from 'react';
import ModalNote from './ModalNote';
import { toast } from 'react-toastify';
import api from '../api'; // ensure this file exists and exports an axios instance
import { motion } from 'framer-motion';

export default function NotesTable() {
  const [notes, setNotes] = useState([]); // always default to array
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // fetch notes from backend
  async function fetchNotes() {
    setLoading(true);
    setError(null);
    try {
      // api is expected to attach Authorization header automatically via interceptor
      const res = await api.get('/notes');
      // Defensive: ensure res.data is an array
      if (Array.isArray(res.data)) {
        setNotes(res.data);
      } else {
        console.warn('Unexpected /notes response shape:', res.data);
        setNotes([]);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError(err);
      // If auth error, show friendly message
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Session expired — please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        toast.error('Failed to load notes. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createNote(payload) {
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", payload.title);
      formData.append("content", payload.content || "");

      if (payload.file) {
        formData.append("file", payload.file);
      }

      const res = await api.post(
        "/notes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Note uploaded successfully");

      setOpen(false);

      setNotes(prev => [res.data, ...prev]);

    } catch (err) {
      console.error("Upload failed:", err);

      toast.error(
        err?.response?.data?.message ||
        "Upload failed"
      );
    } finally {
      setSaving(false);
    }
  }

  // optional delete helper (useful during development)
  async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    try {
      const res = await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success(res.data?.message);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete note');
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">My Notes</h3>
        <div className="flex gap-2">
          <button
            onClick={() => { setOpen(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + New
          </button>
          <button
            onClick={() => fetchNotes()}
            className="px-3 py-2 rounded border hover:shadow"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white p-3 rounded shadow">
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading notes...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            Error loading notes. Check console for details.
          </div>
        ) : notes.length === 0 ? (
          <div className="p-6 text-center text-slate-400">No notes yet — create one!</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm uppercase text-slate-400">
                <th className="p-2">Title</th>
                <th className="p-2">Content</th>
                <th className="p-2">File</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(n => (
                <motion.tr
                  key={n.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="border-t"
                >
                  <td className="p-2 align-top font-medium text-sm">
                    {n.title}
                  </td>

                  <td className="p-2 align-top text-sm text-slate-600">
                    {n.content ? n.content.slice(0, 200) : '-'}
                  </td>

                  <td className="p-2 align-top">
                    {n.fileUrl ? (
                      <a
                        href={`http://localhost:5000${n.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {n.fileName || 'View File'}
                      </a>
                    ) : (
                      <span className="text-slate-400">
                        No file
                      </span>
                    )}
                  </td>

                  <td className="p-2 align-top text-sm">
                    <button
                      onClick={() => navigator.clipboard?.writeText(n.content || '') && toast.success('Copied')}
                      className="mr-2 px-3 py-1 rounded border"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalNote
        open={open}
        onClose={() => setOpen(false)}
        onSave={(payload) => {
          // ensure minimal validation before sending
          if (!payload?.title || !payload.title.trim()) {
            toast.error('Please enter a title');
            return;
          }
          createNote(payload);
        }}
        initial={{ title: '', content: '' }}
      />

      {/* saving overlay */}
      {saving && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/40 absolute inset-0"></div>
          <div className="relative bg-white p-6 rounded shadow">
            Saving...
          </div>
        </div>
      )}
    </div>
  );
}
