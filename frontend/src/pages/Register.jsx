import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, ShieldCheck, BarChart2, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: <ShieldCheck size={16} color="#60a5fa" />, title: 'Datos 100% privados', desc: 'Cifrado bcrypt. Solo tú accedes a tu información.' },
  { icon: <BarChart2 size={16} color="#a78bfa" />, title: 'Análisis clínicos', desc: 'TIR, HbA1c estimada y exportación a PDF.' },
  { icon: <Smartphone size={16} color="#34d399" />, title: 'Instalable como app', desc: 'Accede desde cualquier dispositivo sin instalar nada.' },
];

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', tipoDiabetes: 'Tipo 2' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
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
            Controla tu salud<br />con <span>inteligencia</span>
          </h1>
          <p className="auth-subline">
            Únete a quienes ya llevan un control profesional de su glucosa. Crea tu cuenta gratuita en segundos.
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
            <h2>Crear cuenta</h2>
            <p>Comienza a controlar tu glucosa hoy</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-input"
                type="text" name="nombre"
                value={form.nombre} onChange={handleChange}
                placeholder="Ej: María García"
                autoComplete="name" required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                className="form-input"
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="tu@correo.com"
                autoComplete="email" required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(mín. 8 caracteres)</span></label>
              <input
                className="form-input"
                type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password" required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de diabetes</label>
              <select className="form-input" name="tipoDiabetes" value={form.tipoDiabetes} onChange={handleChange}>
                <option>Tipo 1</option>
                <option>Tipo 2</option>
                <option>Otro</option>
              </select>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <div className="auth-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
