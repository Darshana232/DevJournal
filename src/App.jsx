import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './hooks/useAuth';
import { JournalProvider } from './context/JournalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Spinner } from './components/ui/Spinner';

// Eagerly loaded pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import EditEntry from './pages/EditEntry';
import EntryDetail from './pages/EntryDetail';
import Settings from './pages/Settings';

// Lazy loaded pages (Insights uses Recharts which is heavy)
const Insights = lazy(() => import('./pages/Insights'));

/** Protected Route Wrapper */
function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wraps all protected routes with Sidebar and JournalProvider
  return (
    <JournalProvider>
      <div className="flex bg-bg min-h-screen text-text-primary">
        <Sidebar />
        <main className="flex-1 w-full md:ml-60 pb-16 md:pb-0">
          <div className="px-4 py-6 sm:px-8 sm:py-8 h-full">
            <Outlet />
          </div>
        </main>
        <Navbar />
      </div>
    </JournalProvider>
  );
}

/** Public Route Wrapper (redirects to dashboard if logged in) */
function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-bg" />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="/edit/:id" element={<EditEntry />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/insights"
            element={
              <Suspense fallback={<div className="flex h-64 items-center justify-center"><Spinner /></div>}>
                <Insights />
              </Suspense>
            }
          />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Global Toast Notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: '!bg-elevated !text-text-primary !border !border-border !rounded-md !font-sans !shadow-lg',
          duration: 3000,
        }}
      />
    </Router>
  );
}
