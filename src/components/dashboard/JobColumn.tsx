import { useState } from "react";
import JobCard from "./JobCard";

type JobItem = {
  id: string;
  title: string;
  company: string;
  status_id: string;
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
  onDrop: (statusId: string) => void;
  draggedItem: string | null;
};

export default function JobColumn({
  status,
  items,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedItem
}: JobColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(status.id)
  }
  return (
    <div
      className={`flex flex-col border-r border-stone-200 h-full bg-stone-50 relative overflow-y-auto transition-colors ${
        isDragOver ? "bg-blue-50 border-blue-300" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 sticky top-0 z-10 bg-stone-50 text-center">
        <h3 className="text-lg text-stone-500">{status.title}</h3>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {items.map((item) => (
          <JobCard
            key={item.id}
            item={item}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedItem === item.id}
          />
        ))}
      </div>
    </div>

  );
}