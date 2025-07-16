import { useState, useRef, useCallback, memo } from "react";
import JobCard from "./JobCard";
import JobContentModal from "./JobContentModal";
import NewJobModal from "./NewJobModal";
import type { JobItem, JobStatus } from "../../types/job";

type JobColumnProps = {
  status: JobStatus;
  items: JobItem[];
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  onDrop: (statusId: string, insertIndex: number) => void;
  draggedItem: string | null;
  onUpdateJob: (
    jobId: string,
    updatedJob: {
      title: string;
      company: string;
      location?: string;
      link?: string;
      notes?: string;
    }
  ) => void;
};

const JobColumn = memo(
  function JobColumn({
    status,
    items,
    onDragStart,
    onDragEnd,
    onDrop,
    draggedItem,
    onUpdateJob,
  }: JobColumnProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
    const [editingJob, setEditingJob] = useState<JobItem | null>(null);
    const columnRef = useRef<HTMLDivElement>(null);

    const getDropIndex = useCallback(
      (e: React.DragEvent): number => {
        if (!columnRef.current) return items.length;

        const cards = columnRef.current.querySelectorAll("[data-job-card]");
        const cardArray = Array.from(cards);

        for (let i = 0; i < cardArray.length; i++) {
          const card = cardArray[i];
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;

          if (e.clientY < cardCenter) {
            return i;
          }
        }

        return items.length;
      },
      [items.length]
    );

    const handleDragOver = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);

        const newDropIndex = getDropIndex(e);
        if (newDropIndex !== dropIndex) {
          setDropIndex(newDropIndex);
        }
      },
      [getDropIndex, dropIndex]
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      if (!columnRef.current?.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
        setDropIndex(null);
      }
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const finalDropIndex = getDropIndex(e);
        onDrop(status.id, finalDropIndex);
        setDropIndex(null);
      },
      [getDropIndex, onDrop, status.id]
    );

    const handleJobClick = useCallback((job: JobItem) => {
      setSelectedJob(job);
    }, []);

    const handleEditJob = useCallback((job: JobItem) => {
      setSelectedJob(null);
      setEditingJob(job);
    }, []);

    const handleCloseModal = useCallback(() => {
      setSelectedJob(null);
    }, []);

    const handleCloseEditModal = useCallback(() => {
      setEditingJob(null);
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          if (selectedJob) {
            setSelectedJob(null);
          } else if (editingJob) {
            setEditingJob(null);
          }
        }
      },
      [selectedJob, editingJob]
    );

    const columnClasses = `
    flex flex-col border-r border-stone-200 h-full bg-stone-50 
    relative overflow-y-auto transition-colors
    ${isDragOver ? "bg-blue-50 border-blue-300" : ""}
  `.trim();

    return (
      <div
        ref={columnRef}
        className={columnClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label={`${status.title} column with ${items.length} jobs`}
      >
        <div className="p-4 sticky flex flex-col min-h-[108px] items-center top-0 z-10 bg-stone-50 text-center">
          <h3 className="text-xl tracking-wide text-stone-500">
            {status.title}
          </h3>
          {items.length > 0 && (
            <p
              className="min-w-6 h-6 px-2 bg-stone-400 text-white rounded-full flex items-center justify-center text-sm font-semibold"
              aria-label={`${items.length} jobs in ${status.title}`}
            >
              {items.length}
            </p>
          )}
        </div>

        <div className="p-4 space-y-4 flex-1">
          {items.map((item, index) => {
            const isDraggedItem = draggedItem === item.id;
            const isOriginColumn =
              isDraggedItem && items.some((i) => i.id === draggedItem);

            return (
              <div key={item.id}>
                {isDragOver && dropIndex === index && (
                  <div
                    className="h-1 bg-blue-400 rounded-full mx-2 mb-2 transition-all duration-200"
                    role="presentation"
                    aria-hidden="true"
                  />
                )}

                {isDraggedItem && isOriginColumn ? (
                  <JobCard
                    item={item}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={false}
                    isGhost={true}
                    onJobClick={handleJobClick}
                  />
                ) : (
                  <JobCard
                    item={item}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={isDraggedItem}
                    onJobClick={handleJobClick}
                  />
                )}
              </div>
            );
          })}

          {isDragOver && dropIndex === items.length && (
            <div
              className="h-1 bg-blue-400 rounded-full mx-2 transition-all duration-200"
              role="presentation"
              aria-hidden="true"
            />
          )}

          {items.length === 0 && !isDragOver && (
            <div className="text-center text-gray-400 py-8">
              No jobs in this column
            </div>
          )}
        </div>

        {selectedJob && (
          <JobContentModal
            onClose={handleCloseModal}
            job={selectedJob}
            onEdit={handleEditJob}
          />
        )}

        {editingJob && (
          <NewJobModal
            onClose={handleCloseEditModal}
            onUpdate={onUpdateJob}
            existingJob={editingJob}
          />
        )}

        <div className="sr-only">
          Use arrow keys to navigate between jobs, Enter to select, Escape to
          close modals
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.items === nextProps.items &&
      prevProps.draggedItem === nextProps.draggedItem &&
      prevProps.status.id === nextProps.status.id &&
      prevProps.status.title === nextProps.status.title
    );
  }
);

export default JobColumn;
