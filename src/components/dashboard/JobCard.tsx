type JobCardProps = {
  title: string;
  company: string;
};

export default function JobCard({ title, company }: JobCardProps) {
  return (
    <div className="bg-white border border-stone-300 rounded p-3 shadow-sm">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-600">{company}</p>
    </div>
  );
}