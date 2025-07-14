import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import NewJobModal from "./NewJobModal";
import JobColumn from "./JobColumn";

type JobList = {
  id: string;
  title: string;
  created_at: string;
};

type JobItem = {
  id: string;
  title: string;
  company: string;
  location?: string;
  link?: string;
  notes?: string;
  status_id: string;
  created_at: string;
};

type JobStatus = {
  id: string;
  title: string;
  order: number;
  created_at: string;
};

type JobListViewProps = {
  listId: string;
};

export default function JobListView({ listId }: JobListViewProps) {
  const [list, setList] = useState<JobList | null>(null);
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  useEffect(() => {
    if (!listId) return;
    fetchData(listId);
  }, [listId]);

  const fetchData = async (listId: string) => {
    setLoading(true);

    const [listRes, itemsRes, statusesRes] = await Promise.all([
      supabase.from("job_list").select("*").eq("id", listId),
      supabase
        .from("job_item")
        .select("*")
        .eq("job_list_id", listId)
        .order("created_at", { ascending: false }),
      supabase
        .from("job_status")
        .select("*")
        .eq("job_list_id", listId)
        .order("order", { ascending: true }),
    ]);

    if (listRes.error)
      console.error("Error fetching job list:", listRes.error.message);
    else setList(listRes.data?.[0] ?? null);

    if (itemsRes.error)
      console.error("Error fetching job items:", itemsRes.error.message);
    else setJobItems(itemsRes.data ?? []);

    if (statusesRes.error)
      console.error("Error fetching job statuses:", statusesRes.error.message);
    else setJobStatuses(statusesRes.data ?? []);

    setLoading(false);
  };

  const handleCreateJob = async (newJob: {
    title: string;
    company: string;
    location?: string;
    link?: string;
    description?: string;
    notes?: string;
  }) => {
    const firstStatus = jobStatuses[0];
    if (!firstStatus) return;

    const { data, error } = await supabase
      .from("job_item")
      .insert({
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        link: newJob.link,
        notes: newJob.notes,
        job_list_id: listId,
        status_id: firstStatus.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error.message);
      return;
    }

    setJobItems((prev) => [data, ...prev]);
  };

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = async (targettedStatusId: string) => {
    if (!draggedItem || draggedItem === targettedStatusId) return;

    const item = jobItems.find((job) => job.id === draggedItem);
    if (!item || item.status_id === targettedStatusId) return;

    setJobItems((prev) => prev.map((job) => job.id === draggedItem ? { ...job, status_id: targettedStatusId} : job ) )

    const { error } = await supabase
      .from("job_item")
      .update({ status_id: targettedStatusId })
      .eq("id", draggedItem);

    if (error) {
      console.log("Error updating job status:", error.message);

      setJobItems((prev) => prev.map((job) => job.id === draggedItem ? { ...job, status_id: item.status_id } : job ))
    }

    setDraggedItem(null)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!list) return <p className="text-red-600">Job list not found.</p>;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-4 border-b-2 border-stone-200 bg-white sticky top-0 z-20">
        <h1 className="text-xl mb-0 font-semibold">{list.title}</h1>
        <button
          className="bg-azul text-white px-3 py-2 rounded text-sm"
          onClick={() => setShowModal(true)}
        >
          + New Job
        </button>
      </div>

      {showModal && (
        <NewJobModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateJob}
        />
      )}

      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] min-w-full border-l border-gray-200 h-full">
          {jobStatuses.map((status) => {
            const cards = jobItems.filter(
              (item) => item.status_id === status.id
            );
            return (
              <JobColumn
                key={status.id}
                status={status}
                items={cards}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                draggedItem={draggedItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
