import { useState } from 'preact/hooks';
import { supabase } from '../../lib/supabase';

type AddListModalProps = {
  onClose: () => void;
  onCreated: () => void; // triggers a refetch in Sidebar
};

export default function AddListModal({ onClose, onCreated }: AddListModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('List title is required.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('job_list').insert([{ title }]);

    if (error) {
      setError(error.message);
    } else {
      onCreated();
      onClose();
    }

    setSaving(false);
  };

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Create New Job List</h2>

        <input
          type="text"
          placeholder="List title"
          value={title}
          onInput={(e) => setTitle(e.currentTarget.value)}
          class="w-full border px-3 py-2 rounded mb-3"
        />

        {error && <p class="text-sm text-red-600 mb-2">{error}</p>}

        <div class="flex justify-end gap-3">
          <button
            class="text-sm text-gray-600 hover:underline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            class="text-sm bg-azul text-white px-4 py-2 rounded hover:bg-azul/90"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}