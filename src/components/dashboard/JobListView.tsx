import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import NewJobModal from "./NewJobModal";
import JobColumn from "./JobColumn";
import { Loader } from "lucide-react";
import type { JobItem, JobStatus } from "../../types/job";

type JobListViewProps = {
  listId: string;
  showNewJobModal: boolean;
  setShowNewJobModal: (show: boolean) => void;
};

export default function JobListView({ 
  listId, 
  showNewJobModal, 
  setShowNewJobModal 
}: JobListViewProps) {
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) return;
    fetchData(listId);
  }, [listId]);

  const fetchData = async (listId: string) => {
    setLoading(true);

    const [itemsRes, statusesRes] = await Promise.all([
      supabase
        .from("job_item")
        .select("*")
        .eq("job_list_id", listId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("job_status")
        .select("*")
        .eq("job_list_id", listId)
        .order("order", { ascending: true }),
    ]);

    if (itemsRes.error)
      console.error("Error fetching job items:", itemsRes.error.message);
    else setJobItems(itemsRes.data ?? []);

    if (statusesRes.error)
      console.error("Error fetching job statuses:", statusesRes.error.message);
    else setJobStatuses(statusesRes.data ?? []);

    setLoading(false);
  };

  const calculateNewOrder = (
    targetStatusId: string,
    insertIndex: number
  ): number => {
    const statusItems = jobItems
      .filter((item) => item.status_id === targetStatusId)
      .sort((a, b) => a.sort_order - b.sort_order);

    if (insertIndex === 0) {
      if (statusItems.length === 0) return 1.0;
      return statusItems[0].sort_order / 2;
    }

    if (insertIndex >= statusItems.length) {
      if (statusItems.length === 0) return 1.0;
      return statusItems[statusItems.length - 1].sort_order + 1;
    }

    const prevOrder = statusItems[insertIndex - 1].sort_order;
    const nextOrder = statusItems[insertIndex].sort_order;
    return (prevOrder + nextOrder) / 2;
  };

  const shouldRebalance = (order: number): boolean => {
    const decimalPart = order % 1;
    return (
      decimalPart !== 0 && decimalPart.toString().split(".")[1]?.length > 6
    );
  };

  const rebalanceColumn = async (statusId: string) => {
    const statusItems = jobItems
      .filter((item) => item.status_id === statusId)
      .sort((a, b) => a.sort_order - b.sort_order);

    const updates = statusItems.map((item, index) => ({
      id: item.id,
      sort_order: (index + 1) * 10,
    }));

    if (updates.length === 0) return;

    const { error } = await supabase.from("job_item").upsert(
      updates.map((update) => ({
        id: update.id,
        sort_order: update.sort_order,
      })),
      {
        onConflict: "id",
        ignoreDuplicates: false,
      }
    );

    if (error) {
      console.error("Error rebalancing column:", error);
      return;
    }

    setJobItems((prev) =>
      prev.map((item) => {
        const update = updates.find((u) => u.id === item.id);
        return update ? { ...item, sort_order: update.sort_order } : item;
      })
    );
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

    const newOrder = calculateNewOrder(firstStatus.id, 0);

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
        sort_order: newOrder,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error.message);
      return;
    }

    setJobItems((prev) => [
      data,
      ...prev.filter((item) => item.id !== data.id),
    ]);
  };

  const handleUpdateJob = async (jobId: string, updatedJob: {
    title: string;
    company: string;
    location?: string;
    link?: string;
    notes?: string;
  }) => {
    const { error } = await supabase
      .from("job_item")
      .update({
        title: updatedJob.title,
        company: updatedJob.company,
        location: updatedJob.location,
        link: updatedJob.link,
        notes: updatedJob.notes,
      })
      .eq("id", jobId);

    if (error) {
      console.error("Error updating job:", error.message);
      return;
    }

    setJobItems((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, ...updatedJob }
          : job
      )
    );
  };

  const handleDeleteJob = async (jobId: string) => {
    setJobItems((prev) => prev.filter((job) => job.id !== jobId));

    const { error } = await supabase
      .from("job_item")
      .delete()
      .eq("id", jobId);

    if (error) {
      console.error("Error deleting job:", error.message);
      fetchData(listId);
      return;
    }
  }

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = async (targetStatusId: string, insertIndex: number) => {
    if (!draggedItem) return;

    const item = jobItems.find((job) => job.id === draggedItem);
    if (!item) return;

    const newOrder = calculateNewOrder(targetStatusId, insertIndex);

    if (
      item.status_id === targetStatusId &&
      Math.abs(item.sort_order - newOrder) < 0.000001
    ) {
      return;
    }

    setJobItems((prev) =>
      prev.map((job) =>
        job.id === draggedItem
          ? { ...job, status_id: targetStatusId, sort_order: newOrder }
          : job
      )
    );

    const { error } = await supabase
      .from("job_item")
      .update({ status_id: targetStatusId, sort_order: newOrder })
      .eq("id", draggedItem);

    if (error) {
      console.error("Error updating job:", error.message);
      setJobItems((prev) =>
        prev.map((job) =>
          job.id === draggedItem
            ? { ...job, status_id: item.status_id, sort_order: item.sort_order }
            : job
        )
      );
      return;
    }

    if (shouldRebalance(newOrder)) {
      setTimeout(() => rebalanceColumn(targetStatusId), 100);
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-stone-50">
        <div className="flex flex-row gap-4">
          <Loader className="animate-spin text-stone-500"/>
          <p className="animate-pulse text-stone-500 m-0 leading-snug">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {showNewJobModal && (
        <NewJobModal
          onClose={() => setShowNewJobModal(false)}
          onCreate={handleCreateJob}
        />
      )}

      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] min-w-full border-l border-gray-200 h-full">
          {jobStatuses.map((status) => {
            const cards = jobItems
              .filter((item) => item.status_id === status.id)
              .sort((a, b) => a.sort_order - b.sort_order);
            return (
              <JobColumn
                key={status.id}
                status={status}
                items={cards}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                draggedItem={draggedItem}
                onUpdateJob={handleUpdateJob}
                onDeleteJob={handleDeleteJob}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}