import { useEffect, useMemo, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { supabase } from "../../lib/supabase";
import { LogOut, Plus, Trash2 } from "lucide-preact";
import { useAuth } from "../../hooks/useAuth";

type JobList = {
  id: string;
  title: string;
  created_at: string;
};

type SidebarProps = {
  selectedListId: string | null;
  onSelect: (id: string | null) => void;
  onAddNewClick: (onCreated: () => void) => void;
};

export default function Sidebar({
  selectedListId,
  onSelect,
  onAddNewClick,
}: SidebarProps) {
  const [lists, setLists] = useState<JobList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const { logout } = useAuth();
  const { route } = useLocation();

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

  const handleLogout = async () => {
    await logout();
    route("/");
  };

  const renderedListItems = useMemo(() => {
    return lists.map((list) => (
      <li
        key={list.id}
        role="option"
        class={`flex items-center justify-between group rounded hover:bg-gray-100 ${
          selectedListId === list.id ? "bg-gray-100" : ""
        }`}
      >
        <button
          onClick={() => onSelect(list.id)}
          aria-current={selectedListId === list.id ? "page" : undefined}
          aria-label={`Select job list: ${list.title}`}
          class={`flex-1 text-left text-sm py-2 px-3 ${
            selectedListId === list.id ? "text-azul rounded font-semibold bg-gray-100" : ""
          }`}
        >
          {list.title}
        </button>

        <button
          onClick={async () => {
            const confirmDelete = confirm(`Delete "${list.title}"?`);
            if (!confirmDelete) return;

            const { error } = await supabase
              .from("job_list")
              .delete()
              .eq("id", list.id);

            if (error) {
              alert("Error deleting list: " + error.message);
            } else {
              if (selectedListId === list.id) {
                onSelect(null);
              }
              setLists((prev) => prev.filter((l) => l.id !== list.id));
            }
          }}
          class="text-gray-700 hover:text-red-500 px-3 py-2 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:text-red-500"
          aria-label={`Delete list: ${list.title}`}
          title={`Delete "${list.title}"`}
        >
          <Trash2 size={18} />
        </button>
      </li>
    ));
  }, [lists, selectedListId]);

  return (
    <aside
      class="w-[260px] shrink-0 h-full flex flex-col bg-white"
      role="complementary"
      aria-label="Job lists sidebar"
    >
      <div class="py-4 px-7 text-5xl grenze-gotisch-display">
        Skadi
      </div>

      <nav class="flex-1 overflow-y-auto p-4">
        <button
          onClick={() => onAddNewClick(() => setRefreshKey((k) => k + 1))}
          class="group flex items-center gap-2 w-full mb-4 px-3 py-2 rounded hover:text-azul hover:bg-azul/10"
        >
          <Plus
            size={20}
            class="rounded-full text-azul group-hover:bg-azul group-hover:text-white group-hover:p-1"
          />
          New List
        </button>
        {loading ? (
          <p
            class="text-sm text-gray-500 px-2"
            role="status"
            aria-live="polite"
          >
            Loading...
          </p>
        ) : lists.length === 0 ? (
          <p class="text-sm text-gray-500 px-2">No job lists yet.</p>
        ) : (
          <>
            <ul class="flex flex-col gap-2" role="listbox" aria-label="Job lists">
              {renderedListItems}
            </ul>
          </>
        )}
      </nav>

      <div class="p-4">
        <button
          onClick={handleLogout}
          class="flex items-center gap-2 w-full mb-4 px-3 py-2 rounded text-red-700 hover:bg-red-pantone/10"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
