import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Menu, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <header className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
          <Menu size={22} />
        </button>
        <span className="topbar-title">
          <Droplets size={16} style={{ display: 'inline', marginRight: 6, color: '#60a5fa' }} />
          Diabet Gluc
        </span>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">{children}</main>
    </div>
  );
}
