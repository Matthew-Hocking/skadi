import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Sidebar, AddListModal, JobListView } from "../components/dashboard";

function Dashboard() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshAfterCreate, setRefreshAfterCreate] = useState<() => void>(() => () => {});

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedListId={selectedListId}
        onSelect={setSelectedListId}
        onAddNewClick={(refreshFn) => {
          setRefreshAfterCreate(() => refreshFn);
          setShowAddModal(true);
        }}
      />

      <main className="flex-1 overflow-y-auto">
        {!selectedListId ? (
          <p className="text-gray-500">Select a job list to get started.</p>
        ) : (
          <JobListView listId={selectedListId} />
        )}
      </main>

      {showAddModal && (
        <AddListModal
          onClose={() => setShowAddModal(false)}
          onCreated={refreshAfterCreate}
        />
      )}
    </div>
  );
}

export default function ProtectedDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <Dashboard />;
}
