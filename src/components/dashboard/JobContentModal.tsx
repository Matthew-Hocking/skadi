import type { JobItem } from "../../types/job";
import ModalWrapper from "../ModalWrapper";
import { ExternalLink, MapPin, Calendar } from "lucide-react";

type JobContentModalProps = {
  onClose: () => void;
  job: JobItem;
  onEdit: (job: JobItem) => void;
};

export default function JobContentModal({
  onClose,
  job,
  onEdit,
}: JobContentModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(job)

  return (
    <ModalWrapper onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            {job.title}
          </h2>
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

        {job.link && (
          <div>
            <h3 className="font-medium text-stone-900 mb-2">Job Posting</h3>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-azul hover:text-azul-dark transition-colors"
            >
              <ExternalLink size={16} />
              View Original Posting
            </a>
          </div>
        )}

        {job.notes && (
          <div className="bg-stone-50 p-3 rounded-lg">
            <p className="text-stone-700 whitespace-pre-wrap">{job.notes}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
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
    </ModalWrapper>
  );
}
