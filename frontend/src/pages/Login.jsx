import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Activity, TrendingUp, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: <Activity size={16} color="#60a5fa" />, title: 'Gráficas en tiempo real', desc: 'Visualiza tu glucosa en 7, 14 o 30 días.' },
  { icon: <TrendingUp size={16} color="#a78bfa" />, title: 'HbA1c y TIR estimados', desc: 'Métricas clínicas calculadas automáticamente.' },
  { icon: <Bell size={16} color="#34d399" />, title: 'Recordatorios inteligentes', desc: 'Alertas para medicamentos y mediciones.' },
];

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Panel izquierdo (branding) ── */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="auth-brand-icon">
              <Droplets size={22} color="#fff" />
            </div>
            <span className="auth-brand-name">Diabet Gluc</span>
          </div>

          <h1 className="auth-headline">
            Tu glucosa,<br />bajo <span>control total</span>
          </h1>
          <p className="auth-subline">
            Registra mediciones, analiza tendencias y recibe alertas — todo desde un solo lugar diseñado para personas con diabetes.
          </p>

          <div className="auth-features">
            {FEATURES.map((f, i) => (
              <div className="auth-feature" key={i}>
                <div className="auth-feature-icon">{f.icon}</div>
                <div className="auth-feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h2>Bienvenido de vuelta</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <Link to="/forgot-password" className="auth-forgot">¿Olvidaste tu contraseña?</Link>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
