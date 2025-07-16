import { useState } from "react";
import type { JobItem } from "../../types/job";
import ModalWrapper from "../ModalWrapper";
import { ExternalLink, MapPin, Calendar, Trash2 } from "lucide-react";

type JobContentModalProps = {
  onClose: () => void;
  job: JobItem;
  onEdit: (job: JobItem) => void;
  onDelete: (jobId: string) => void;
};

export default function JobContentModal({
  onClose,
  job,
  onEdit,
  onDelete,
}: JobContentModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

    const handleDelete = () => {
      onDelete(job.id);
      onClose();
    };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="space-y-6">
        <div>
          {job.link ? (
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-azul hover:text-azul-dark transition-colors cursor-pointer"
              >
                {job.title}
                <ExternalLink size={20} />
              </a>
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              {job.title}
            </h2>
          )}
          <p className="text-lg text-stone-600 mb-4">{job.company}</p>

          <div className="flex flex-wrap gap-4 text-sm text-stone-500">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                {job.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              Added {formatDate(job.created_at)}
            </div>
          </div>
        </div>

        {job.notes && (
          <div className="bg-stone-50 p-3 rounded-lg">
            <p className="text-stone-700 whitespace-pre-wrap">{job.notes}</p>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 mb-3">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 px-4 py-2 transition-colors"
          >
            <Trash2 size={16} />
            Delete Job
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-800 px-4 py-2 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(job)}
              className="bg-azul text-white px-4 py-2 rounded hover:bg-azul-dark transition-colors"
            >
              Edit Job
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}