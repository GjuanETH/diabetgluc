import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', tipoDiabetes: 'Tipo 2' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
      <div className="auth-card">
        <div className="auth-logo">
          <Droplets size={36} color="#2563eb" style={{ marginBottom: 8 }} />
          <h1>Diabet Gluc</h1>
          <p>Crear nueva cuenta</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input className="form-input" type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña (mín. 8 caracteres)</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de diabetes</label>
            <select className="form-input" name="tipoDiabetes" value={form.tipoDiabetes} onChange={handleChange}>
              <option>Tipo 1</option>
              <option>Tipo 2</option>
              <option>Otro</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }} type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
