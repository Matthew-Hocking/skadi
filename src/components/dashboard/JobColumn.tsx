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
};

export default function JobColumn({ status, items }: JobColumnProps) {
  return (
    <div className="flex flex-col border-r border-stone-200 h-full bg-stone-50 relative overflow-y-auto">
      <div className="p-4 sticky top-0 z-10 bg-stone-50 text-center">
        <h3 className="text-lg text-stone-500">{status.title}</h3>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {items.map((item) => (
          <JobCard key={item.id} title={item.title} company={item.company} />
        ))}
      </div>
    </div>
  );
}