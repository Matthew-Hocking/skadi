import { useEffect, useState } from "preact/hooks";
import { supabase } from "../../lib/supabase";

type JobList = {
  id: string;
  title: string;
  created_at: string;
};

type SidebarProps = {
  selectedListId: string | null;
  onSelect: (id: string) => void;
  onAddNewClick: () => void;
  refreshKey: number;
};

export default function Sidebar({
  selectedListId,
  onSelect,
  onAddNewClick,
  refreshKey,
}: SidebarProps) {
  const [lists, setLists] = useState<JobList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const { data, error } = await supabase
        .from("job_list")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching job lists:", error.message);
      } else {
        setLists(data ?? []);
      }

      setLoading(false);
    };

    fetchLists();
  }, [refreshKey]);

  return (
    <aside class="w-[260px] shrink-0 border-r border-gray-300 h-full flex flex-col">
      <div class="p-4 border-b border-gray-300 font-bold text-lg">
        Your lists
      </div>

      <nav class="flex-1 overflow-y-auto px-2 py-4">
        {loading ? (
          <p class="text-sm text-gray-500 px-2">Loading...</p>
        ) : lists.length === 0 ? (
          <p class="text-sm text-gray-500 px-2">No job lists yet.</p>
        ) : (
          <ul class="flex flex-col gap-1">
            {lists.map((list) => (
              <li key={list.id}>
                <button
                  onClick={() => onSelect(list.id)}
                  class={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-200 ${
                    selectedListId === list.id ? "bg-white font-semibold" : ""
                  }`}
                >
                  {list.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div class="p-4 border-t border-gray-300">
        <button
          onClick={onAddNewClick}
          class="w-full text-sm bg-azul text-white px-3 py-2 rounded hover:bg-azul/90"
        >
          + New List
        </button>
      </div>
    </aside>
  );
}
