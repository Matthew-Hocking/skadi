import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Ellipsis, Loader, LogOut, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { JobList } from "../../types/job";

type SidebarProps = {
  onAddNewClick: (onCreated: () => void) => void;
  collapsed: boolean;
};

export default function Sidebar({ onAddNewClick, collapsed }: SidebarProps) {
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
          className={`
            flex-1 text-left text-sm py-2 px-3
            ${listId === list.id ? "text-indigo-600 rounded font-semibold bg-gray-100" : ""}
          `}
          title={collapsed ? list.title : undefined}
        >
          {collapsed ? (
            <div className="w-6 h-6 rounded bg-indigo-600 text-white text-xs flex items-center justify-center font-semibold">
              {list.title.charAt(0).toUpperCase()}
            </div>
          ) : (
            list.title
          )}
        </button>

        {!collapsed && (
          <button
            onClick={() => handleDeleteList(list)}
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-600/10 px-3 py-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label={`Delete list: ${list.title}`}
            title={`Delete "${list.title}"`}
          >
            <Ellipsis size={18} />
          </button>
        )}
      </li>
    ));
  }, [lists, listId, collapsed]);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-[260px]"
      } shrink-0 h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}
      role="complementary"
      aria-label="Job lists sidebar"
    >
      <nav className="flex-1 p-4">
        <button
          onClick={() => onAddNewClick(() => setRefreshKey((k) => k + 1))}
          className="group flex items-center gap-2 w-full mb-4 px-3 py-2 text-nowrap rounded hover:text-indigo-600 hover:bg-indigo-600/10"
          title={collapsed ? "New Job List" : undefined}
        >
          <Plus
            size={20}
            className="rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:p-1 shrink-0"
          />
          {!collapsed && "New Job List"}
        </button>
        {loading ? (
          <div className={`flex ${collapsed ? "justify-center" : "flex-row gap-4"}`}>
            <Loader className="animate-spin text-stone-500"/>
            {!collapsed && <p className="animate-pulse text-stone-500 m-0 text-sm">Loading...</p>}
          </div>
        ) : lists.length === 0 ? (
          !collapsed && <p className="text-sm text-gray-500 px-2">No job lists yet.</p>
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

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-red-700 hover:bg-red-50 text-nowrap"
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}