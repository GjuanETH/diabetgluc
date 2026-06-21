import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  ClipboardList, Bell, Apple, User, AlertTriangle,
  TrendingUp, Activity, Droplets, Hash, ChevronRight,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Skeleton, SkeletonCard } from '../components/Skeleton';

const QUICK = [
  { label: 'Historial',     desc: 'Ver todos los registros', to: '/historial',     cls: 'green',  Icon: ClipboardList },
  { label: 'Recordatorios', desc: 'Alertas de medicación',   to: '/recordatorios', cls: 'purple', Icon: Bell },
  { label: 'Nutrición',     desc: 'Guía de alimentos',        to: '/nutricion',     cls: 'orange', Icon: Apple },
  { label: 'Perfil',        desc: 'Configurar rangos',        to: '/perfil',        cls: 'pink',   Icon: User },
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
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [dias, setDias]       = useState(7);

  const fetchStats = useCallback(async (d = 7) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/glucose/stats?dias=${d}`);
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(dias); }, [fetchStats, location.key]);

  const handlePeriod = (d) => { setDias(d); fetchStats(d); };

  const ultima     = stats?.ultimaMedicion;
  const alertaBaja = ultima?.estado === 'Bajo';
  const alertaAlta = ultima?.estado === 'Alto';
  const tir        = stats?.tir;

  const hba1cColor = !stats?.hba1c ? 'var(--text-muted)'
    : Number(stats.hba1c) < 7 ? 'var(--green)'
    : Number(stats.hba1c) < 8 ? 'var(--amber)'
    : 'var(--red)';

  const hba1cLabel = !stats?.hba1c ? null
    : Number(stats.hba1c) < 7 ? 'En objetivo'
    : Number(stats.hba1c) < 8 ? 'Ligeramente elevada'
    : 'Elevada — consulta tu médico';

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Bienvenido de vuelta, <strong>{user?.nombre?.split(' ')[0]}</strong></p>
      </div>

      {/* ── Alertas ── */}
      {alertaBaja && (
        <div className="alert-banner danger">
          <AlertTriangle size={18} />
          Alerta: última medición en nivel BAJO ({ultima.valor} mg/dL) — posible hipoglucemia.
        </div>
      )}
      {alertaAlta && (
        <div className="alert-banner warning">
          <AlertTriangle size={18} />
          Alerta: última medición en nivel ALTO ({ultima.valor} mg/dL) — consulta con tu médico.
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        {loading ? (
          <>
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
            <SkeletonCard lines={2} />
          </>
        ) : (
          <>
            {/* Última medición */}
            <div className="stat-card accent-blue">
              <div className="stat-icon-wrap stat-icon-blue">
                <Droplets size={18} />
              </div>
              <div className="stat-label">Última medición</div>
              <div className="stat-value">
                {ultima ? ultima.valor : '—'}
                {ultima && <span className="stat-unit">mg/dL</span>}
              </div>
              {ultima && (
                <span className={`badge badge-${ultima.estado.toLowerCase()}`} style={{ marginTop: 10, display: 'inline-flex' }}>
                  {ultima.estado}
                </span>
              )}
              {!ultima && <div className="stat-sub">Sin registros aún</div>}
            </div>

            {/* Promedio semanal */}
            <div className="stat-card accent-green">
              <div className="stat-icon-wrap stat-icon-green">
                <TrendingUp size={18} />
              </div>
              <div className="stat-label">Promedio semanal</div>
              <div className="stat-value">
                {stats?.promedioSemanal != null ? stats.promedioSemanal : '—'}
                {stats?.promedioSemanal != null && <span className="stat-unit">mg/dL</span>}
              </div>
              <div className="stat-sub">Últimos 7 días</div>
            </div>

            {/* Registros totales */}
            <div className="stat-card accent-purple">
              <div className="stat-icon-wrap stat-icon-purple">
                <Hash size={18} />
              </div>
              <div className="stat-label">Registros totales</div>
              <div className="stat-value">{stats?.total ?? 0}</div>
              <div className="stat-sub">en tu historial</div>
            </div>
          </>
        )}
      </div>

      {/* ── HbA1c + TIR ── */}
      <div className="tir-row">
        {/* HbA1c */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div className="stat-icon-wrap stat-icon-purple" style={{ width: 32, height: 32, borderRadius: 8, marginBottom: 0 }}>
              <Activity size={15} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>HbA1c Estimada</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Basada en 90 días</div>
            </div>
          </div>

          {loading ? (
            <>
              <Skeleton height={44} width="55%" style={{ marginBottom: 8 }} />
              <Skeleton height={12} width="75%" />
            </>
          ) : stats?.hba1c ? (
            <>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
                {stats.hba1c}<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>%</span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: hba1cColor, background: `${hba1cColor}18`, padding: '3px 10px', borderRadius: 999 }}>
                {hba1cLabel}
              </span>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              <Droplets size={20} style={{ marginBottom: 8, opacity: 0.35 }} />
              <p>Necesitas al menos 7 lecturas en 90 días para estimar la HbA1c.</p>
            </div>
          )}
        </div>

        {/* TIR */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div className="stat-icon-wrap stat-icon-green" style={{ width: 32, height: 32, borderRadius: 8, marginBottom: 0 }}>
              <Activity size={15} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Tiempo en Rango</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Últimos 30 días</div>
            </div>
          </div>

          {loading ? (
            <>
              <Skeleton height={8} style={{ marginBottom: 14, borderRadius: 999 }} />
              <Skeleton height={12} width="65%" style={{ marginBottom: 7 }} />
              <Skeleton height={12} width="50%" style={{ marginBottom: 7 }} />
              <Skeleton height={12} width="45%" />
            </>
          ) : tir ? (
            <>
              <div className="tir-bar-wrap">
                <div className="tir-bar-normal" style={{ width: `${tir.normal}%` }} />
                <div className="tir-bar-bajo"   style={{ width: `${tir.bajo}%` }} />
                <div className="tir-bar-alto"   style={{ width: `${tir.alto}%` }} />
              </div>
              <div className="tir-legend">
                <span className="tir-label"><span className="tir-dot normal" />Normal <strong style={{ marginLeft: 4 }}>{tir.normal}%</strong></span>
                <span className="tir-label"><span className="tir-dot bajo"   />Bajo <strong style={{ marginLeft: 4 }}>{tir.bajo}%</strong></span>
                <span className="tir-label"><span className="tir-dot alto"   />Alto <strong style={{ marginLeft: 4 }}>{tir.alto}%</strong></span>
              </div>
              <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                {tir.total} lecturas analizadas
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No hay suficientes datos (últimos 30 días).
            </div>
          )}
        </div>
      </div>

      {/* ── Gráfica ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 7 }}>
              <TrendingUp size={16} color="var(--primary)" />
              Evolución de glucosa
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Valores en mg/dL con líneas de rango objetivo
            </div>
          </div>
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
          <Skeleton height={250} radius={10} />
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
              <LineChart data={stats.grafica} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="fecha" tickFormatter={fmtAxis} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} unit=" mg" width={70} />
                <Tooltip
                  formatter={(v) => [`${v} mg/dL`, 'Glucosa']}
                  labelFormatter={fmtTooltipLabel}
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, boxShadow: 'var(--shadow-md)' }}
                />
                <ReferenceLine y={user?.rangoObjetivoMin ?? 70} stroke="#dc2626" strokeDasharray="4 2" label={{ value: 'Mín', fontSize: 10, fill: '#dc2626', position: 'insideTopRight' }} />
                <ReferenceLine y={user?.rangoObjetivoMax ?? 180} stroke="#d97706" strokeDasharray="4 2" label={{ value: 'Máx', fontSize: 10, fill: '#d97706', position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="valor" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card-bg)' }} activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--card-bg)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── Quick cards ── */}
      <div className="section-title">Accesos rápidos</div>
      <div className="quick-grid">
        {QUICK.map(({ label, desc, to, cls, Icon }) => (
          <button key={to} className={`quick-card ${cls}`} onClick={() => navigate(to)}>
            <div className="quick-card-icon">
              <Icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="quick-card-title">{label}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 2 }}>{desc}</div>
            </div>
            <ChevronRight size={16} style={{ opacity: 0.6 }} />
          </button>
        ))}
      </div>
    </div>
  );
}
