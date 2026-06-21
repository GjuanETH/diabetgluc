import { useState } from 'react';
import { Save, User } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    tipoDiabetes: user?.tipoDiabetes || 'Tipo 2',
    rangoObjetivoMin: user?.rangoObjetivoMin ?? 70,
    rangoObjetivoMax: user?.rangoObjetivoMax ?? 180,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (Number(form.rangoObjetivoMin) >= Number(form.rangoObjetivoMax)) {
      setError('El rango mínimo debe ser menor que el máximo');
      return;
    }
    setSaving(true);
    try {
      await api.put('/profile', {
        ...form,
        rangoObjetivoMin: Number(form.rangoObjetivoMin),
        rangoObjetivoMax: Number(form.rangoObjetivoMax),
      });
      await refreshUser();
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally { setSaving(false); }
  };

  const initials = (user?.nombre || 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <h2>Mi Perfil</h2>
        <p>Gestiona tu información personal y rangos de glucosa</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:24, alignItems:'start' }}>
        <div className="card" style={{ textAlign:'center', padding:32 }}>
          <div className="profile-avatar" style={{ margin:'0 auto 12px' }}>{initials}</div>
          <div style={{ fontWeight:700, fontSize:'1.1rem' }}>{user?.nombre}</div>
          <div style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginTop:4 }}>{user?.email}</div>
          <div style={{ marginTop:12 }}>
            <span className="badge badge-normal">{user?.tipoDiabetes}</span>
          </div>
          <hr className="section-divider" />
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>
            <div>Rango objetivo</div>
            <div style={{ fontWeight:700, color:'var(--text)', fontSize:'1rem', marginTop:4 }}>
              {user?.rangoObjetivoMin} – {user?.rangoObjetivoMax} mg/dL
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight:700, marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
            <User size={18} /> Editar información
          </h3>

          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div style={{ background:'var(--green-bg)', color:'var(--green)', padding:'10px 14px', borderRadius:'var(--radius-sm)', fontSize:'0.875rem', marginBottom:16 }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de diabetes</label>
              <select className="form-input" name="tipoDiabetes" value={form.tipoDiabetes} onChange={handleChange}>
                <option>Tipo 1</option>
                <option>Tipo 2</option>
                <option>Otro</option>
              </select>
            </div>

            <hr className="section-divider" />
            <h4 style={{ fontWeight:600, marginBottom:16, color:'var(--text-muted)', fontSize:'0.875rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>Rangos objetivo de glucosa</h4>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Mínimo (mg/dL)</label>
                <input className="form-input" type="number" name="rangoObjetivoMin" min="40" max="150"
                  value={form.rangoObjetivoMin} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Máximo (mg/dL)</label>
                <input className="form-input" type="number" name="rangoObjetivoMax" min="100" max="400"
                  value={form.rangoObjetivoMax} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>
              Al cambiar los rangos, todos tus registros existentes se reclasificarán automáticamente.
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
