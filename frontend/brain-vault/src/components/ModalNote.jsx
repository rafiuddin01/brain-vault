/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ModalNote({
  open,
  onClose,
  onSave,
  initial = { title: '', content: '' }
}) {

  const [selectedFile, setSelectedFile] = useState(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-white p-6 rounded-2xl w-11/12 max-w-md shadow-2xl"
      >
        <h3 className="text-lg font-semibold mb-4">
          Add / Edit Note
        </h3>

        <input
          id="modalTitle"
          placeholder="Title"
          defaultValue={initial.title}
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          id="modalContent"
          placeholder="Content"
          defaultValue={initial.content}
          className="w-full p-2 border rounded mb-3"
          rows="4"
        />

        <input
          type="file"
          accept=".pdf,image/*,.txt,.doc,.docx"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) =>
            setSelectedFile(e.target.files[0])
          }
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              const title =
                document.getElementById('modalTitle').value;

              const content =
                document.getElementById('modalContent').value;

              onSave({
                title,
                content,
                file: selectedFile
              });
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}