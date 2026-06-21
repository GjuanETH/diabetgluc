import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ClipboardList, Bell, Apple, User, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const QUICK = [
  { label: 'Historial',      to: '/historial',     cls: 'green',  Icon: ClipboardList },
  { label: 'Recordatorios',  to: '/recordatorios', cls: 'purple', Icon: Bell },
  { label: 'Nutrición',      to: '/nutricion',     cls: 'orange', Icon: Apple },
  { label: 'Perfil',         to: '/perfil',         cls: 'pink',   Icon: User },
];

const fmt = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/glucose/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  const ultima = stats?.ultimaMedicion;
  const alertaBaja = ultima && ultima.estado === 'Bajo';
  const alertaAlta = ultima && ultima.estado === 'Alto';

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      {alertaBaja && (
        <div className="alert-banner danger">
          <AlertTriangle size={18} />
          Alerta: última medición en nivel BAJO ({ultima.valor} mg/dL) — posible hipoglucemia.
        </div>
      )}
      {alertaAlta && (
        <div className="alert-banner warning">
          <AlertTriangle size={18} />
          Alerta: última medición en nivel ALTO ({ultima.valor} mg/dL) — revisar con tu médico.
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Última medición</div>
          {loading ? <div className="stat-value">—</div> : (
            <>
              <div className="stat-value">
                {ultima ? ultima.valor : '—'}
                {ultima && <span className="stat-unit">mg/dL</span>}
              </div>
              {ultima && (
                <span className={`badge badge-${ultima.estado.toLowerCase()} mt-4`} style={{ marginTop: 8 }}>
                  {ultima.estado}
                </span>
              )}
            </>
          )}
        </div>

        <div className="stat-card dark">
          <div className="stat-label">Promedio semanal</div>
          <div className="stat-value">
            {loading ? '—' : stats?.promedioSemanal != null ? stats.promedioSemanal : '—'}
            {!loading && stats?.promedioSemanal != null && <span className="stat-unit" style={{ color: '#94a3b8' }}>mg/dL</span>}
          </div>
          {!loading && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>Últimos 7 días</div>}
        </div>

        <div className="stat-card">
          <div className="stat-label">Registros totales</div>
          <div className="stat-value">{loading ? '—' : stats?.total ?? 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>en tu historial</div>
        </div>
      </div>

      <div className="card mb-4" style={{ marginBottom: 24 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700 }}><TrendingUp size={16} style={{ display:'inline', marginRight:6 }} />Evolución de glucosa — última semana</h3>
        </div>
        {loading ? (
          <div style={{ height: 240, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>Cargando...</div>
        ) : !stats?.grafica?.length ? (
          <div className="empty-state">
            <p>No hay registros esta semana</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/historial')}>Agregar registro</button>
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.grafica} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fecha" tickFormatter={fmt} tick={{ fontSize: 12 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} unit=" mg/dL" width={80} />
                <Tooltip
                  formatter={(v) => [`${v} mg/dL`, 'Glucosa']}
                  labelFormatter={(l) => new Date(l).toLocaleString('es-CO')}
                />
                <ReferenceLine y={user?.rangoObjetivoMin ?? 70} stroke="#dc2626" strokeDasharray="4 2" label={{ value: 'Mín', fontSize: 11, fill: '#dc2626' }} />
                <ReferenceLine y={user?.rangoObjetivoMax ?? 180} stroke="#d97706" strokeDasharray="4 2" label={{ value: 'Máx', fontSize: 11, fill: '#d97706' }} />
                <Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="quick-grid">
        {QUICK.map(({ label, to, cls, Icon }) => (
          <button key={to} className={`quick-card ${cls}`} onClick={() => navigate(to)}>
            <Icon size={28} className="quick-card-icon" />
            <span className="quick-card-title">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
