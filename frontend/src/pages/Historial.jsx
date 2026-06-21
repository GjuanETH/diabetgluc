import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Filter, Download, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';

const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmtFecha = (iso) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const LIMIT = 15;
const EMPTY_FORM = { valor: '', fecha: '', nota: '' };
const ESTADOS = ['Todos', 'Normal', 'Bajo', 'Alto'];

export default function Historial() {
  const { user }   = useAuth();
  const { addToast } = useToast();

  const [data, setData]     = useState({ records: [], total: 0, pages: 1 });
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({ estado: 'Todos', desde: '', hasta: '' });
  const [applied, setApplied] = useState({ estado: 'Todos', desde: '', hasta: '' });

  const buildParams = (p, f) => {
    const params = new URLSearchParams({ page: p, limit: LIMIT });
    if (f.estado !== 'Todos') params.set('estado', f.estado);
    if (f.desde) params.set('desde', f.desde);
    if (f.hasta) params.set('hasta', f.hasta);
    return params.toString();
  };

  const load = useCallback(async (p = page, f = applied) => {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/glucose?${buildParams(p, f)}`);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => { load(page, applied); }, [page]);

  const applyFilters = () => {
    setApplied({ ...filters });
    setPage(1);
    load(1, filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const empty = { estado: 'Todos', desde: '', hasta: '' };
    setFilters(empty);
    setApplied(empty);
    setPage(1);
    load(1, empty);
    setShowFilters(false);
  };

  const activeFilterCount = [
    applied.estado !== 'Todos',
    !!applied.desde,
    !!applied.hasta,
  ].filter(Boolean).length;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, fecha: toLocalInput(new Date()) });
    setError('');
    setModal(true);
  };

  const openEdit = (r) => {
    setEditing(r._id);
    setForm({ valor: r.valor, fecha: toLocalInput(r.fecha), nota: r.nota || '' });
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
      if (editing) {
        await api.put(`/glucose/${editing}`, payload);
        addToast('Registro actualizado correctamente', 'success');
      } else {
        await api.post('/glucose', payload);
        addToast('Registro guardado correctamente', 'success');
      }
      await load(page, applied);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/glucose/${id}`);
      addToast('Registro eliminado', 'success');
      setDeleteId(null);
      const newPage = data.records.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      await load(newPage, applied);
    } catch {
      addToast('Error al eliminar el registro', 'error');
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { data: res } = await api.get(`/glucose?export=true&${buildParams(1, applied).replace(/page=\d+&limit=\d+&?/, '')}`);
      const records = res.records;
      if (!records.length) { addToast('No hay registros para exportar', 'warning'); return; }

      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Historial de Glucosa — Diabet Gluc', 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Paciente: ${user?.nombre}  |  Rango: ${user?.rangoObjetivoMin}–${user?.rangoObjetivoMax} mg/dL`, 14, 26);
      doc.text(`Exportado: ${new Date().toLocaleString('es-CO')}`, 14, 32);

      autoTable(doc, {
        startY: 38,
        head: [['Fecha y hora', 'Valor (mg/dL)', 'Estado', 'Nota']],
        body: records.map(r => [
          fmtFecha(r.fecha),
          r.valor,
          r.estado,
          r.nota || '—',
        ]),
        headStyles: { fillColor: [37, 99, 235] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9 },
      });

      doc.save(`historial-glucosa-${new Date().toISOString().slice(0, 10)}.pdf`);
      addToast(`PDF generado con ${records.length} registros`, 'success');
    } catch (err) {
      addToast('Error al generar el PDF', 'error');
    } finally {
      setExporting(false);
    }
  };

  const badgeCls = (e) => e === 'Normal' ? 'badge-normal' : e === 'Bajo' ? 'badge-bajo' : 'badge-alto';

  const pages = Array.from({ length: data.pages }, (_, i) => i + 1);
  const visiblePages = pages.filter(p => Math.abs(p - page) <= 2 || p === 1 || p === data.pages);

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h2>Historial de Glucosa</h2>
          <p>{data.total} registros{activeFilterCount > 0 ? ' (filtrado)' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFilters(s => !s)}
            style={{ position: 'relative' }}
          >
            <SlidersHorizontal size={15} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleExportPDF} disabled={exporting}>
            <Download size={15} />
            {exporting ? 'Generando...' : 'PDF'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={15} /> Agregar
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Estado</label>
            <select className="form-input" value={filters.estado} onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))}>
              {ESTADOS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Desde</label>
            <input type="date" className="form-input" value={filters.desde} onChange={e => setFilters(f => ({ ...f, desde: e.target.value }))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Hasta</label>
            <input type="date" className="form-input" value={filters.hasta} onChange={e => setFilters(f => ({ ...f, hasta: e.target.value }))} />
          </div>
          <div className="flex gap-2" style={{ alignSelf: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Limpiar</button>
            <button className="btn btn-primary btn-sm" onClick={applyFilters}>Aplicar</button>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={44} radius={6} />
            ))}
          </div>
        ) : data.records.length === 0 ? (
          <div className="empty-state">
            <p>{activeFilterCount > 0 ? 'No hay registros con estos filtros' : 'No tienes registros aún'}</p>
            {activeFilterCount > 0
              ? <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Quitar filtros</button>
              : <button className="btn btn-primary btn-sm" onClick={openCreate}>Agregar tu primer registro</button>
            }
          </div>
        ) : (
          <>
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
                  {data.records.map((r) => (
                    <tr key={r._id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtFecha(r.fecha)}</td>
                      <td><strong>{r.valor}</strong> mg/dL</td>
                      <td><span className={`badge ${badgeCls(r.estado)}`}>{r.estado}</span></td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.nota || '—'}
                      </td>
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

            {data.pages > 1 && (
              <div className="pagination">
                <span className="pagination-info">
                  Mostrando {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, data.total)} de {data.total}
                </span>
                <div className="pagination-controls">
                  <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                    <ChevronLeft size={14} />
                  </button>
                  {visiblePages.map((p, i, arr) => {
                    const prev = arr[i - 1];
                    return (
                      <>
                        {prev && p - prev > 1 && <span key={`gap-${p}`} style={{ padding: '5px 4px', color: 'var(--text-muted)' }}>…</span>}
                        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                      </>
                    );
                  })}
                  <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === data.pages}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
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
                <input className="form-input" type="number" min="1" max="600"
                  value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  placeholder="Ej: 120" required />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha y hora</label>
                <input className="form-input" type="datetime-local"
                  value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nota (opcional)</label>
                <input className="form-input" type="text"
                  value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })}
                  placeholder="Ej: Después del desayuno" />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
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
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(null)}><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.
            </p>
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
