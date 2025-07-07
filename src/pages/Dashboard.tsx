import { useEffect, useState } from "preact/hooks";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "preact-iso";
import { Sidebar, AddListModal } from "../components/dashboard";

function Dashboard() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshAfterCreate, setRefreshAfterCreate] = useState<() => void>(() => () => {});

  return (
    <div class="flex h-screen">
      <Sidebar
        selectedListId={selectedListId}
        onSelect={setSelectedListId}
        onAddNewClick={(refreshFn) => {
          setRefreshAfterCreate(() => refreshFn);
          setShowAddModal(true);
        }}
      />

      <main class="flex-1 overflow-y-auto p-6">
        <h1 class="text-2xl font-bold mb-4">
          {selectedListId ? `List: ${selectedListId}` : "Select a job list"}
        </h1>
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
  const { route } = useLocation();

  useEffect(() => {
    if (!loading && !user) route("/");
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <Dashboard />;
}
