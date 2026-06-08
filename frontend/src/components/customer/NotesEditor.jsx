// src/components/customer/NotesEditor.jsx
// A small widget for the matchmaker to write/edit notes about a customer.
import { useState } from "react";
import { Save, Edit2 } from "lucide-react";
import { updateCustomerNotes } from "../../services/customer.service.js";
import toast from "react-hot-toast";

const NotesEditor = ({ customerId, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCustomerNotes(customerId, notes);
      toast.success("Notes saved!");
      setEditing(false);
    } catch {
      toast.error("Failed to save notes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-base font-semibold text-gray-800">
          📝 Matchmaker Notes
        </h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-medium"
          >
            <Edit2 size={13} /> Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add notes about this client..."
            className="w-full text-sm border border-rose-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none font-sans text-gray-700"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={13} />
              {saving ? "Saving..." : "Save Notes"}
            </button>
            <button
              onClick={() => { setEditing(false); setNotes(initialNotes || ""); }}
              className="text-xs text-gray-400 hover:text-gray-600 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 font-sans leading-relaxed">
          {notes || <span className="italic text-gray-300">No notes yet. Click Edit to add.</span>}
        </p>
      )}
    </div>
  );
};

export default NotesEditor;
