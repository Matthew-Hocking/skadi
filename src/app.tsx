import {  LandingPage, ProtectedDashboard } from "./pages";
import { useAuth } from "./hooks/useAuth";
import { ErrorBoundary, LocationProvider, Route, Router, useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";

export function App() {
  const { user, loading } = useAuth();
  const { route } = useLocation();

  if (loading) {
    return <div>Loading...</div>
  }

  useEffect(() => {
  if (user && location.pathname === '/') {
    route('/dashboard');
  }
}, [user]);

  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={LandingPage} />
          <Route path="/dashboard" component={ProtectedDashboard} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}