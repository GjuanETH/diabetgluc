import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Droplets, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('El enlace de recuperación es inválido. Solicita uno nuevo.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
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
          <p>Nueva contraseña</p>
        </div>

        {success ? (
          <div>
            <div className="auth-success">
              ¡Contraseña actualizada! Redirigiendo al inicio de sesión...
            </div>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            {token && (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    className="form-input" type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    className="form-input" type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Repite la contraseña"
                    required
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>
              </form>
            )}
          </>
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
