import { useEffect } from 'preact/hooks';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'preact-iso';

function Dashboard() {
  const { logout } = useAuth();
  const { route } = useLocation();

  const handleLogout = async () => {
    await logout();
    route('/');
  };

  return (
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

      <button
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  );
}

export default function ProtectedDashboard() {
  const { user, loading } = useAuth();
  const { route } = useLocation();

  useEffect(() => {
    if (!loading && !user) route('/');
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <Dashboard />;
}