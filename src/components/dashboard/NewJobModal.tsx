import { useEffect, useRef, useState, useCallback } from "react";
import ModalWrapper from "../ModalWrapper";

type JobItem = {
  id: string;
  title: string;
  company: string;
  status_id: string;
  sort_order: number;
  created_at: string;
};

type NewJobModalProps = {
  onClose: () => void;
  onCreate?: (job: {
    title: string;
    company: string;
    location?: string;
    link?: string;
    notes?: string;
  }) => void;
  onUpdate?: (jobId: string, job: {
    title: string;
    company: string;
    location?: string;
    link?: string;
    notes?: string;
  }) => void;
  existingJob?: JobItem & {
    location?: string;
    link?: string;
    notes?: string;
  };
};

export default function NewJobModal({
  onClose,
  onCreate,
  onUpdate,
  existingJob,
}: NewJobModalProps) {
  const [title, setTitle] = useState(existingJob?.title || "");
  const [company, setCompany] = useState(existingJob?.company || "");
  const [location, setLocation] = useState(existingJob?.location || "");
  const [link, setLink] = useState(existingJob?.link || "");
  const [notes, setNotes] = useState(existingJob?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const isEditing = !!existingJob;

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      previouslyFocusedElement.current?.focus();
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const jobData = {
        title: title.trim(),
        company: company.trim(),
        location: location?.trim() || undefined,
        link: link?.trim() || undefined,
        notes: notes?.trim() || undefined,
      };

      if (isEditing && onUpdate) {
        onUpdate(existingJob.id, jobData);
      } else if (onCreate) {
        onCreate(jobData);
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} job:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, company, location, link, notes, isSubmitting, isEditing, onUpdate, onCreate, existingJob, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleSubmit]);

  const isFormValid = title.trim() && company.trim();

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-semibold mb-5">
        {isEditing ? "Edit Job" : "Add New Job"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col space-y-6 py-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-stone-200 p-1 focus:border-azul focus:outline-none transition-colors"
              required
              maxLength={100}
              aria-describedby="title-error"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border-b border-stone-200 p-1 focus:border-azul focus:outline-none transition-colors"
              required
              maxLength={100}
              aria-describedby="company-error"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-b border-stone-200 p-1 focus:border-azul focus:outline-none transition-colors"
              maxLength={100}
              placeholder="e.g., San Francisco, Remote, New York"
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium mb-1">
              Job Link
            </label>
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border-b border-stone-200 p-1 focus:border-azul focus:outline-none transition-colors"
              placeholder="https://..."
              aria-describedby="link-help"
            />
            <p id="link-help" className="text-xs text-gray-500 mt-1">
              Link to job posting or company page
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-stone-200 rounded p-3 resize-vertical focus:border-azul focus:outline-none transition-colors"
            rows={4}
            maxLength={1000}
            placeholder="Add any notes about this job, interview details, salary info, etc..."
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {notes.length}/1000 characters
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 px-4 py-2 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="bg-azul text-white px-4 py-2 rounded hover:bg-azul-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting 
              ? (isEditing ? "Updating..." : "Creating...") 
              : (isEditing ? "Update" : "Create")
            }
          </button>
        </div>
      </form>

      <div className="text-xs text-gray-500 mt-4 text-center">
        Press Escape to cancel • Ctrl+Enter to submit
      </div>
    </ModalWrapper>
  );
}