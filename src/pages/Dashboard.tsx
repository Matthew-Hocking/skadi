import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sidebar, AddListModal, JobListView } from "../components/dashboard";

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshAfterCreate, setRefreshAfterCreate] = useState<() => void>(
    () => () => {}
  );
  const { listId } = useParams<{ listId: string }>();

  const handleAddNewClick = (refreshFn: () => void) => {
    setRefreshAfterCreate(() => refreshFn);
    setShowAddModal(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onAddNewClick={handleAddNewClick} />

      <main className="flex-1 overflow-y-auto">
        {!listId ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Create a new list to get started.</p>
          </div>
        ) : (
          <JobListView listId={listId} />
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
