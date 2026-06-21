import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Bell } from 'lucide-react';
import api from '../api/axios';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TIPOS = ['Medicamento', 'Medición', 'Otro'];
const EMPTY_FORM = { tipo: 'Medicamento', hora: '08:00', dias: [] };

export default function Recordatorios() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/reminders'); setReminders(data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleDia = (d) => {
    setForm((f) => ({
      ...f,
      dias: f.dias.includes(d) ? f.dias.filter((x) => x !== d) : [...f.dias, d],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (form.dias.length === 0) { setError('Selecciona al menos un día'); return; }
    setSaving(true);
    try {
      await api.post('/reminders', form);
      await load();
      setModal(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const toggleActivo = async (r) => {
    await api.put(`/reminders/${r._id}`, { activo: !r.activo });
    await load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/reminders/${id}`);
    setDeleteId(null);
    await load();
  };

  const tipoColor = { Medicamento: '#2563eb', 'Medición': '#16a34a', Otro: '#7c3aed' };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h2>Recordatorios</h2>
          <p>Gestiona tus alertas de medicamentos y mediciones</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setError(''); setModal(true); }}>
          <Plus size={16} /> Nuevo recordatorio
        </button>
      </div>

      {loading ? (
        <div style={{ padding:32, textAlign:'center', color:'var(--text-muted)' }}>Cargando...</div>
      ) : reminders.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Bell size={40} style={{ color:'var(--text-muted)', marginBottom:12 }} />
            <p>No tienes recordatorios configurados</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY_FORM); setModal(true); }}>
              Crear primer recordatorio
            </button>
          </div>
        </div>
      ) : (
        reminders.map((r) => (
          <div key={r._id} className="reminder-card" style={{ opacity: r.activo ? 1 : 0.55 }}>
            <div className="reminder-info">
              <div className="reminder-title" style={{ color: tipoColor[r.tipo] || 'var(--text)' }}>
                <Bell size={14} style={{ display:'inline', marginRight:6 }} />
                {r.tipo}
              </div>
              <div className="reminder-meta">{r.hora} · {r.dias.join(', ')}</div>
              <div style={{ marginTop:4 }}>
                <span className={`badge ${r.activo ? 'badge-normal' : 'badge-alto'}`}>
                  {r.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div className="reminder-actions">
              <label className="toggle" title={r.activo ? 'Desactivar' : 'Activar'}>
                <input type="checkbox" checked={r.activo} onChange={() => toggleActivo(r)} />
                <span className="toggle-slider" />
              </label>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(r._id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))
      )}

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Nuevo recordatorio</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-input" value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})}>
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Hora</label>
                <input className="form-input" type="time" value={form.hora}
                  onChange={(e) => setForm({...form, hora: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Días de la semana</label>
                <div className="days-toggle">
                  {DIAS.map((d) => (
                    <button key={d} type="button" className={`day-btn ${form.dias.includes(d) ? 'selected' : ''}`}
                      onClick={() => toggleDia(d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth:360 }}>
            <div className="modal-header">
              <h3 className="modal-title">Eliminar recordatorio</h3>
            </div>
            <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>¿Seguro que quieres eliminar este recordatorio?</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
