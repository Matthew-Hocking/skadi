import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Loader, Menu, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Sidebar, AddListModal, JobListView } from "../components/dashboard";
import type { JobList } from "../types/job";

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshAfterCreate, setRefreshAfterCreate] = useState<() => void>(
    () => () => {}
  );
  const [currentList, setCurrentList] = useState<JobList | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const { listId } = useParams<{ listId: string }>();

  useEffect(() => {
    if (!listId) {
      setCurrentList(null);
      return;
    }

    const fetchCurrentList = async () => {
      setLoadingList(true);
      const { data, error } = await supabase
        .from("job_list")
        .select("*")
        .eq("id", listId)
        .single();

      if (error) {
        console.error("Error fetching current list:", error.message);
        setCurrentList(null);
      } else {
        setCurrentList(data);
      }
      setLoadingList(false);
    };

    fetchCurrentList();
  }, [listId]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddNewClick = (refreshFn: () => void) => {
    setRefreshAfterCreate(() => refreshFn);
    setShowAddModal(true);
  };

  const handleNewJobClick = () => {
    setShowNewJobModal(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-12 p-4 border-b-2 border-stone-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skadi
          </div>
        </div>

        <div className="flex justify-between items-center flex-1">
          <div className="flex items-center">
            {loadingList ? (
              <div className="flex flex-row gap-2 items-center">
                <Loader className="animate-spin text-stone-500" size={16} />
                <p className="animate-pulse text-stone-500 m-0 text-sm">
                  Loading...
                </p>
              </div>
            ) : currentList ? (
              <h1 className="text-xl mb-0 font-semibold text-nowrap">
                {currentList.title}
              </h1>
            ) : null}
          </div>

          {listId && (
            <button
              className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm leading-tight text-nowrap"
              onClick={handleNewJobClick}
            >
              <Plus size={18} /> New Job
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onAddNewClick={handleAddNewClick}
          collapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-hidden">
          {!listId ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Create a new list to get started.</p>
            </div>
          ) : (
            <JobListView
              listId={listId}
              showNewJobModal={showNewJobModal}
              setShowNewJobModal={setShowNewJobModal}
            />
          )}
        </main>
      </div>

      {showAddModal && (
        <AddListModal
          onClose={() => setShowAddModal(false)}
          onCreated={refreshAfterCreate}
        />
      )}
    </div>
  );
}
