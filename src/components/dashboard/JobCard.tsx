import React from "react";

type JobItem = {
  id: string;
  title: string;
  company: string;
  status_id: string;
  sort_order: number;
  created_at: string;
};

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

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div
      data-job-card
      draggable={!isGhost}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white border border-stone-300 rounded p-3 shadow-sm select-none transition-all duration-150 ${
        isGhost
          ? "opacity-30 border-dashed border-stone-400 scale-95"
          : isDragging
          ? "opacity-0"
          : "cursor-grab hover:shadow-md hover:border-stone-400 hover:scale-[1.02] active:scale-95"
      }`}
    >
      <h4
        className="font-medium text-base mb-2 cursor-pointer hover:text-azul hover:underline underline-offset-2 transition-colors"
        onClick={() => onJobClick(item)}
      >
        {item.title}
      </h4>
      <p className="text-sm text-gray-600">{item.company}</p>
    </div>
  );
}
