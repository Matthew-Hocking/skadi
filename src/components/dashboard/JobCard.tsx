import React from "react";
import type { JobItem } from "../../types/job";

type JobCardProps = {
  item: JobItem;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isGhost?: boolean;
  onJobClick: (job: JobItem) => void;
};

export default function JobCard({
  item,
  onDragStart,
  onDragEnd,
  isDragging,
  isGhost = false,
  onJobClick,
}: JobCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
    onDragStart(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onJobClick(item);
    }
  };

  const cardClasses = `
    bg-white border border-stone-200 rounded-lg p-4 cursor-pointer
    transition-all duration-200 hover:shadow-md hover:border-stone-300
    ${isDragging ? "opacity-50 rotate-2 shadow-lg" : ""}
    ${isGhost ? "opacity-30" : ""}
  `.trim();

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onJobClick(item)}
      onKeyDown={handleKeyDown}
      className={cardClasses}
      data-job-card
      role="button"
      tabIndex={0}
      aria-label={`Job: ${item.title} at ${item.company}`}
    >
      <h4 className="font-medium text-base text-stone-900 mb-1 line-clamp-2">
        {item.title}
      </h4>
      <p className="text-sm text-stone-600 mb-2">{item.company}</p>
      {item.location && (
        <p className="text-xs text-stone-500">{item.location}</p>
      )}
    </div>
  );
}
