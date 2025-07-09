import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

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

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

        const focusables = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute("disabled")
        );

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (focusables.length === 0) return;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    return () => {
      previouslyFocusedElement.current?.focus();
    };
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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
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
              className="text-sm bg-azul text-white px-4 py-2 rounded hover:bg-azul/90"
              disabled={saving}
            >
              {saving ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
