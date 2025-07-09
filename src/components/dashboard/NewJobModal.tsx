import { useEffect, useRef, useState } from "react";
import ModalWrapper from "../ModalWrapper";

type NewJobModalProps = {
  onClose: () => void;
  onCreate: (job: { title: string; company: string }) => void;
};

export default function NewJobModal({ onClose, onCreate }: NewJobModalProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      previouslyFocusedElement.current?.focus();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    onCreate({ title: title.trim(), company: company.trim() });
    onClose();
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Job Title</label>
          <input
            type="text"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-azul text-white px-4 py-2 rounded hover:bg-azul-dark"
          >
            Create
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}