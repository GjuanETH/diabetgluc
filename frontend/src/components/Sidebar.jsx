import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Bell, Apple, User,
  LogOut, Droplets, X, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/historial',     label: 'Historial',     icon: ClipboardList },
  { to: '/recordatorios', label: 'Recordatorios', icon: Bell },
  { to: '/nutricion',     label: 'Nutrición',     icon: Apple },
  { to: '/perfil',        label: 'Perfil',        icon: User },
];

function getInitials(nombre = '') {
  return nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout }      = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout   = () => { logout(); navigate('/login'); };
  const handleNavClick = () => { if (onClose) onClose(); };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">
              <Droplets size={18} color="#fff" />
            </div>
            <div>
              <h1>Diabet Gluc</h1>
              <p>Control de Glucosa</p>
            </div>
          </div>
          <button
            className="hamburger"
            onClick={onClose}
            aria-label="Cerrar menú"
            style={{ display: 'none' }}
            id="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user.nombre)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.nombre}</div>
              <div className="sidebar-user-type">{user.tipoDiabetes || 'Diabetes'}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menú principal</div>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <div className="nav-icon-wrap">
                <Icon size={15} />
              </div>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-actions">
            <button className="btn-theme" onClick={toggleTheme}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
              {dark ? 'Modo claro' : 'Modo oscuro'}
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
