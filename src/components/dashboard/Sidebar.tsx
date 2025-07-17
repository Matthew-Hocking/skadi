import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Loader, LogOut, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

type JobList = {
  id: string;
  title: string;
  created_at: string;
};

type SidebarProps = {
  onAddNewClick: (onCreated: () => void) => void;
};

export default function Sidebar({ onAddNewClick }: SidebarProps) {
  const [lists, setLists] = useState<JobList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();

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

  useEffect(() => {
    if (!loading && lists.length > 0 && !listId) {
      navigate(`/dashboard/list/${lists[0].id}`, { replace: true });
    }
  }, [loading, lists, listId, navigate]);

  useEffect(() => {
    if (!loading && listId && lists.length > 0) {
      const listExists = lists.some((list) => list.id === listId);
      if (!listExists) {
        navigate(
          lists.length > 0 ? `/dashboard/list/${lists[0].id}` : "/dashboard",
          { replace: true }
        );
      }
    }
  }, [loading, listId, lists, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleListSelect = (id: string) => {
    navigate(`/dashboard/list/${id}`);
  };

  const handleDeleteList = async (list: JobList) => {
    const confirmDelete = confirm(`Delete "${list.title}"?`);
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("job_list")
      .delete()
      .eq("id", list.id);

    if (error) {
      alert("Error deleting list: " + error.message);
    } else {
      const updatedLists = lists.filter((l) => l.id !== list.id);
      setLists(updatedLists);

      if (listId === list.id) {
        if (updatedLists.length > 0) {
          navigate(`/dashboard/list/${updatedLists[0].id}`, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    }
  };

  const renderedListItems = useMemo(() => {
    return lists.map((list) => (
      <li
        key={list.id}
        role="option"
        className={`flex items-center justify-between group rounded hover:bg-gray-100 ${
          listId === list.id ? "bg-gray-100" : ""
        }`}
      >
        <button
          onClick={() => handleListSelect(list.id)}
          aria-current={listId === list.id ? "page" : undefined}
          aria-label={`Select job list: ${list.title}`}
          className={`flex-1 text-left text-sm py-2 px-3 ${
            listId === list.id
              ? "text-indigo-600 rounded font-semibold bg-gray-100"
              : ""
          }`}
        >
          {list.title}
        </button>

        <button
          onClick={() => handleDeleteList(list)}
          className="text-gray-700 hover:text-red-500 px-3 py-2 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:text-red-500"
          aria-label={`Delete list: ${list.title}`}
          title={`Delete "${list.title}"`}
        >
          <Trash2 size={18} />
        </button>
      </li>
    ));
  }, [lists, listId]);

  return (
    <aside
      className="w-[260px] shrink-0 h-full flex flex-col bg-white"
      role="complementary"
      aria-label="Job lists sidebar"
    >
      <div className="py-4 px-7 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Skadi</div>

      <nav className="flex-1 overflow-y-auto p-4">
        <button
          onClick={() => onAddNewClick(() => setRefreshKey((k) => k + 1))}
          className="group flex items-center gap-2 w-full mb-4 px-3 py-2 rounded hover:text-indigo-600 hover:bg-indigo-600/10"
        >
          <Plus
            size={20}
            className="rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:p-1"
          />
          New Job List
        </button>
        {loading ? (
          <div className="flex flex-row gap-4">
            <Loader className="animate-spin text-stone-500"/>
            <p className="animate-pulse text-stone-500 m-0 text-sm">Loading...</p>
          </div>
        ) : lists.length === 0 ? (
          <p className="text-sm text-gray-500 px-2">No job lists yet.</p>
        ) : (
          <>
            <ul
              className="flex flex-col gap-2"
              role="listbox"
              aria-label="Job lists"
            >
              {renderedListItems}
            </ul>
          </>
        )}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full mb-4 px-3 py-2 rounded text-red-700 hover:bg-red-pantone/10"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
