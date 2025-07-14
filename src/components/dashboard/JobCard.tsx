type JobItem = {
  id: string;
  title: string;
  company: string;
  status_id: string;
  created_at: string;
};

type JobCardProps = {
  item: JobItem;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;

}

export default function JobCard({
  item,
  onDragStart,
  onDragEnd,
  isDragging,
}: JobCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
    onDragStart(item.id);
  };

  const handleDragEnd = () => {
    onDragEnd();
  }
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white border border-stone-300 rounded p-3 shadow-sm cursor-move transition-all ${
        isDragging
          ? "opacity-50 transform rotate-2 scale-95"
          : "hover:shadow-md hover:border-stone-400"
      }`}
    >
      <h4 className="font-medium">{item.title}</h4>
      <p className="text-sm text-gray-600">{item.company}</p>
    </div>
  );
}