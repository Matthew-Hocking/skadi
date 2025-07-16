import { AuthCallback, LandingPage, ProtectedDashboard } from "./pages";
import { useAuth } from "./hooks/useAuth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/list/:listId"
          element={
            <ProtectedRoute>
              <ProtectedDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
