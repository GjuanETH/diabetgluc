import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ClipboardList, Bell, Apple, User, AlertTriangle, TrendingUp, Activity, Droplets } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Skeleton, SkeletonCard } from '../components/Skeleton';

const QUICK = [
  { label: 'Historial',     to: '/historial',     cls: 'green',  Icon: ClipboardList },
  { label: 'Recordatorios', to: '/recordatorios', cls: 'purple', Icon: Bell },
  { label: 'Nutrición',     to: '/nutricion',     cls: 'orange', Icon: Apple },
  { label: 'Perfil',        to: '/perfil',        cls: 'pink',   Icon: User },
];

const PERIODS = [
  { label: '7 días',  value: 7 },
  { label: '14 días', value: 14 },
  { label: '30 días', value: 30 },
];

const fmtAxis = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', timeZone: 'America/Bogota' });
};

const fmtTooltipLabel = (d) =>
  new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' });

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [dias, setDias]     = useState(7);

  const fetchStats = useCallback(async (d = dias) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/glucose/stats?dias=${d}`);
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(dias); }, [fetchStats, location.key]);

  const handlePeriod = (d) => {
    setDias(d);
    fetchStats(d);
  };

  const ultima    = stats?.ultimaMedicion;
  const alertaBaja = ultima?.estado === 'Bajo';
  const alertaAlta = ultima?.estado === 'Alto';
  const tir        = stats?.tir;

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

      {/* ── Tarjetas de stats ── */}
      <div className="stats-grid">
        {loading ? (
          <>
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-label">Última medición</div>
              <div className="stat-value">
                {ultima ? ultima.valor : '—'}
                {ultima && <span className="stat-unit">mg/dL</span>}
              </div>
              {ultima && (
                <span className={`badge badge-${ultima.estado.toLowerCase()}`} style={{ marginTop: 8 }}>
                  {ultima.estado}
                </span>
              )}
            </div>

            <div className="stat-card dark">
              <div className="stat-label">Promedio semanal</div>
              <div className="stat-value">
                {stats?.promedioSemanal != null ? stats.promedioSemanal : '—'}
                {stats?.promedioSemanal != null && (
                  <span className="stat-unit" style={{ color: '#94a3b8' }}>mg/dL</span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>Últimos 7 días</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Registros totales</div>
              <div className="stat-value">{stats?.total ?? 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>en tu historial</div>
            </div>
          </>
        )}
      </div>

      {/* ── HbA1c + TIR ── */}
      <div className="tir-row">
        {/* HbA1c */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4" style={{ marginBottom: 12 }}>
            <Activity size={16} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>HbA1c Estimada</span>
          </div>
          {loading ? (
            <>
              <Skeleton height={40} width="60%" style={{ marginBottom: 8 }} />
              <Skeleton height={12} width="80%" />
            </>
          ) : stats?.hba1c ? (
            <>
              <div className="stat-value" style={{ fontSize: '2.2rem', marginBottom: 4 }}>
                {stats.hba1c}<span className="stat-unit">%</span>
              </div>
              <div className="text-muted">Calculada con {Math.min(stats.total, 90)} lecturas (90 días)</div>
              <div style={{ marginTop: 8, fontSize: '0.78rem', color: stats.hba1c < 7 ? 'var(--green)' : stats.hba1c < 8 ? 'var(--amber)' : 'var(--red)', fontWeight: 600 }}>
                {stats.hba1c < 7 ? 'En objetivo' : stats.hba1c < 8 ? 'Ligeramente elevada' : 'Elevada — consulta tu médico'}
              </div>
            </>
          ) : (
            <div className="text-muted" style={{ padding: '8px 0' }}>
              <Droplets size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p>Necesitas al menos 7 lecturas en los últimos 90 días para estimar la HbA1c.</p>
            </div>
          )}
        </div>

        {/* TIR */}
        <div className="card">
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <Activity size={16} color="var(--green)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tiempo en Rango (TIR)</span>
            <span className="text-muted" style={{ fontSize: '0.72rem', marginLeft: 4 }}>— últimos 30 días</span>
          </div>
          {loading ? (
            <>
              <Skeleton height={10} style={{ marginBottom: 12, borderRadius: 999 }} />
              <Skeleton height={12} width="70%" style={{ marginBottom: 6 }} />
              <Skeleton height={12} width="55%" style={{ marginBottom: 6 }} />
              <Skeleton height={12} width="50%" />
            </>
          ) : tir ? (
            <>
              <div className="tir-bar-wrap">
                <div className="tir-bar-normal" style={{ width: `${tir.normal}%` }} />
                <div className="tir-bar-bajo"   style={{ width: `${tir.bajo}%` }} />
                <div className="tir-bar-alto"   style={{ width: `${tir.alto}%` }} />
              </div>
              <div className="tir-legend">
                <span className="tir-label"><span className="tir-dot normal" />Normal: <strong style={{ marginLeft: 4 }}>{tir.normal}%</strong></span>
                <span className="tir-label"><span className="tir-dot bajo"   />Bajo: <strong style={{ marginLeft: 4 }}>{tir.bajo}%</strong></span>
                <span className="tir-label"><span className="tir-dot alto"   />Alto: <strong style={{ marginLeft: 4 }}>{tir.alto}%</strong></span>
              </div>
              <div className="text-muted" style={{ marginTop: 8, fontSize: '0.75rem' }}>Basado en {tir.total} lecturas</div>
            </>
          ) : (
            <div className="text-muted">No hay suficientes datos para calcular el TIR.</div>
          )}
        </div>
      </div>

      {/* ── Gráfica ── */}
      <div className="card mb-4" style={{ marginBottom: 24 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} />Evolución de glucosa
          </h3>
          <div className="period-toggle">
            {PERIODS.map(p => (
              <button
                key={p.value}
                className={`period-btn${dias === p.value ? ' active' : ''}`}
                onClick={() => handlePeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Skeleton height={240} radius={8} />
        ) : !stats?.grafica?.length ? (
          <div className="empty-state">
            <p>No hay registros en este período</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/historial')}>
              Agregar registro
            </button>
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.grafica} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="fecha" tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit=" mg/dL" width={85} />
                <Tooltip
                  formatter={(v) => [`${v} mg/dL`, 'Glucosa']}
                  labelFormatter={fmtTooltipLabel}
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                />
                <ReferenceLine
                  y={user?.rangoObjetivoMin ?? 70}
                  stroke="#dc2626" strokeDasharray="4 2"
                  label={{ value: 'Mín', fontSize: 11, fill: '#dc2626' }}
                />
                <ReferenceLine
                  y={user?.rangoObjetivoMax ?? 180}
                  stroke="#d97706" strokeDasharray="4 2"
                  label={{ value: 'Máx', fontSize: 11, fill: '#d97706' }}
                />
                <Line
                  type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={2}
                  dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="quick-grid">
        {QUICK.map(({ label, to, cls, Icon }) => (
          <button key={to} className={`quick-card ${cls}`} onClick={() => navigate(to)}>
            <Icon size={28} />
            <span className="quick-card-title">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
