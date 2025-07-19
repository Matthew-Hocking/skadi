import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import ModalWrapper from "../ModalWrapper";

type AddListModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

export default function AddListModal({
  onClose,
  onCreated,
}: AddListModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) {
      setError("List title is required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("job_list").insert([{ title }]);

    if (error) {
      setError(error.message);
    } else {
      onCreated();
      onClose();
    }

    setSaving(false);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Create New Job List</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="List title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          maxLength={40}
        />

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-600/90"
            disabled={saving}
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}