import ModalWrapper from "../ModalWrapper";

type JobItem = {
  id: string;
  title: string;
  company: string;
  status_id: string;
  sort_order: number;
  created_at: string;
};

type JobContentModalProps = {
  onClose: () => void;
  job: JobItem;
  onEdit: (job: JobItem) => void; // Add this prop
};

export default function JobContentModal({ onClose, job, onEdit }: JobContentModalProps) {
  return (
    <ModalWrapper onClose={onClose}>
      {/* Your job details content */}
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 px-4 py-2 transition-colors"
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
    </ModalWrapper>
  );
}