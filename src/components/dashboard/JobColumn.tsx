import { useState, useRef } from "react";
import JobCard from "./JobCard";

type JobItem = {
  id: string;
  title: string;
  company: string;
  status_id: string;
  sort_order: number;
  created_at: string;
};

type JobStatus = {
  id: string;
  title: string;
  order: number;
  created_at: string;
};

type JobColumnProps = {
  status: JobStatus;
  items: JobItem[];
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  onDrop: (statusId: string, insertIndex: number) => void;
  draggedItem: string | null;
};

export default function JobColumn({
  status,
  items,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedItem,
}: JobColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const getDropIndex = (e: React.DragEvent): number => {
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);

    const newDropIndex = getDropIndex(e);
    setDropIndex(newDropIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!columnRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDropIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const finalDropIndex = getDropIndex(e);
    onDrop(status.id, finalDropIndex);
    setDropIndex(null);
  };

  return (
    <div
      ref={columnRef}
      className={`flex flex-col border-r border-stone-200 h-full bg-stone-50 relative overflow-y-auto transition-colors ${
        isDragOver ? "bg-blue-50 border-blue-300" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 sticky flex flex-col items-center top-0 z-10 bg-stone-50 text-center">
        <h3 className="text-xl tracking-wide text-stone-500">{status.title}</h3>
        {items.length > 0 && (
          <p className="min-w-6 h-6 px-2 bg-stone-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">
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
                <div className="h-1 bg-blue-400 rounded-full mx-2 mb-2 transition-all duration-200" />
              )}

              {isDraggedItem && isOriginColumn ? (
                <JobCard
                  item={item}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  isDragging={false}
                  isGhost={true}
                />
              ) : (
                <JobCard
                  item={item}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  isDragging={isDraggedItem}
                />
              )}
            </div>
          );
        })}

        {isDragOver && dropIndex === items.length && (
          <div className="h-1 bg-blue-400 rounded-full mx-2 transition-all duration-200" />
        )}

        {items.length === 0 && !isDragOver && (
          <div className="text-center text-gray-400 py-8">
            No jobs in this column
          </div>
        )}
      </div>
    </div>
  );
}
