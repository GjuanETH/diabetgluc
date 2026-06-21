import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const toLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmtFecha = (iso) => new Date(iso).toLocaleString('es-CO', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

const EMPTY_FORM = { valor: '', fecha: '', nota: '' };

export default function Historial() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/glucose'); setRecords(data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, fecha: toLocal(new Date()) });
    setError('');
    setModal(true);
  };

  const openEdit = (r) => {
    setEditing(r._id);
    setForm({ valor: r.valor, fecha: toLocal(r.fecha), nota: r.nota || '' });
    setError('');
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.valor || !form.fecha) { setError('Valor y fecha son requeridos'); return; }
    setSaving(true);
    try {
      const payload = { valor: Number(form.valor), fecha: form.fecha, nota: form.nota };
      if (editing) await api.put(`/glucose/${editing}`, payload);
      else await api.post('/glucose', payload);
      await load();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/glucose/${id}`);
    setDeleteId(null);
    await load();
  };

  const badgeClass = (e) => e === 'Normal' ? 'badge-normal' : e === 'Bajo' ? 'badge-bajo' : 'badge-alto';

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h2>Historial de Glucosa</h2>
          <p>Todos tus registros de glucosa</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Agregar registro
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 32, textAlign:'center', color:'var(--text-muted)' }}>Cargando registros...</div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <p>No tienes registros aún</p>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>Agregar tu primer registro</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Nota</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>{fmtFecha(r.fecha)}</td>
                    <td><strong>{r.valor}</strong> mg/dL</td>
                    <td><span className={`badge ${badgeClass(r.estado)}`}>{r.estado}</span></td>
                    <td style={{ color:'var(--text-muted)' }}>{r.nota || '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(r._id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Editar registro' : 'Nuevo registro'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={18} /></button>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Valor (mg/dL)</label>
                <input className="form-input" type="number" min="1" max="600" value={form.valor}
                  onChange={(e) => setForm({...form, valor: e.target.value})} placeholder="Ej: 120" required />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha y hora</label>
                <input className="form-input" type="datetime-local" value={form.fecha}
                  onChange={(e) => setForm({...form, fecha: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nota (opcional)</label>
                <input className="form-input" type="text" value={form.nota}
                  onChange={(e) => setForm({...form, nota: e.target.value})} placeholder="Ej: Después del desayuno" />
              </div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:12 }}>
                Rango objetivo: {user?.rangoObjetivoMin ?? 70} – {user?.rangoObjetivoMax ?? 180} mg/dL
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar eliminación</h3>
            </div>
            <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.</p>
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
