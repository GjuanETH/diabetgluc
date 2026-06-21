import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Droplets size={36} color="#2563eb" style={{ marginBottom: 8 }} />
          <h1>Diabet Gluc</h1>
          <p>Recuperar contraseña</p>
        </div>

        {!sent ? (
          <>
            {error && <div className="auth-error">{error}</div>}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          </>
        ) : (
          <div>
            <div className="auth-success">
              Si el correo está registrado, recibirás un enlace de recuperación.
            </div>

            {resetUrl && (
              <div style={{
                background: '#f1f5f9', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: 14, marginTop: 12,
              }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                  ENLACE DE RECUPERACIÓN (solo visible en modo demo):
                </p>
                <Link
                  to={resetUrl.replace(window.location.origin, '')}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', wordBreak: 'break-all' }}
                >
                  Haz clic aquí para restablecer tu contraseña
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="auth-link" style={{ marginTop: 20 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
