import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Bell, Apple, User, LogOut, Droplets, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/historial',     label: 'Historial',     icon: ClipboardList },
  { to: '/recordatorios', label: 'Recordatorios', icon: Bell },
  { to: '/nutricion',     label: 'Nutrición',     icon: Apple },
  { to: '/perfil',        label: 'Perfil',        icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout }    = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout   = () => { logout(); navigate('/login'); };
  const handleNavClick = () => { if (onClose) onClose(); };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>
              <Droplets size={16} style={{ display: 'inline', marginRight: 6, color: '#60a5fa' }} />
              Diabet Gluc
            </h1>
            <p>Control de Glucosa</p>
          </div>
          <button className="hamburger" onClick={onClose} aria-label="Cerrar menú" id="sidebar-close-btn" style={{ display: 'none' }}>
            <X size={20} />
          </button>
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user.nombre}</div>
            <div className="sidebar-user-type">{user.tipoDiabetes || 'Diabetes'}</div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-actions">
            <button className="btn-theme" onClick={toggleTheme}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? 'Modo claro' : 'Modo oscuro'}
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
