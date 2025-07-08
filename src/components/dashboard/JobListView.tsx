import { useEffect, useState } from 'preact/hooks';
import { supabase } from '../../lib/supabase';


type JobItem = {
  id: string;
  title: string;
  company: string;
  status: string;
  created_at: string;
};

type JobStatus = {
  id: string;
  title: string;
  order: number;
  created_at: string;
}

type JobListViewProps = {
  listId: string;
};

export default function JobListView({ listId }: JobListViewProps) {
  const [items, setItems] = useState<JobItem[]>([]);
  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId) return;

    const fetchData = async () => {
      setLoading(true);

      const [jobItemsResponse, jobStatusResponse] = await Promise.all([
        supabase
          .from('job_item')
          .select('*')
          .eq('list_id', listId)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('job_status')
          .select('*')
          .eq('job_list_id', listId)
          .order('order', { ascending: true })
      ]);

      if (jobItemsResponse.error) {
        console.error('Error fetching job items:', jobItemsResponse.error.message);
      } else {
        setItems(jobItemsResponse.data ?? []);
      }

      if (jobStatusResponse.error) {
        console.error('Error fetching job statuses:', jobStatusResponse.error.message);
      } else {
        setJobStatuses(jobStatusResponse.data ?? []);
      }

      setLoading(false);
    };

    fetchData();
  }, [listId]);

  console.log(items, jobStatuses);

  return (
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Jobs in this list</h2>
        <button class="text-sm bg-azul text-white px-3 py-2 rounded hover:bg-azul/90">
          + Add Job
        </button>
      </div>

      {loading ? (
        <p class="text-sm text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p class="text-sm text-gray-500">No jobs added yet.</p>
      ) : (
        <ul class="grid gap-3">
          {items.map((item) => (
            <li key={item.id} class="p-4 bg-white shadow rounded border border-gray-200">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-medium text-lg">{item.title}</h3>
                  <p class="text-sm text-gray-600">{item.company}</p>
                </div>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded border text-gray-800">
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}