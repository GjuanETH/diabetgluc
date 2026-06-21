const GlucoseRecord = require('../models/GlucoseRecord');

const calcularEstado = (valor, min, max) => {
  if (valor < min) return 'Bajo';
  if (valor > max) return 'Alto';
  return 'Normal';
};

const getRecords = async (req, res) => {
  try {
    const isExport = req.query.export === 'true';
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = isExport ? 5000 : Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = isExport ? 0 : (page - 1) * limit;

    // Filtros opcionales
    const query = { userId: req.user._id };
    if (req.query.estado && req.query.estado !== 'Todos') query.estado = req.query.estado;
    if (req.query.desde || req.query.hasta) {
      query.fecha = {};
      if (req.query.desde) query.fecha.$gte = new Date(req.query.desde);
      if (req.query.hasta) {
        const hasta = new Date(req.query.hasta);
        hasta.setHours(23, 59, 59, 999);
        query.fecha.$lte = hasta;
      }
    }

    const [records, total] = await Promise.all([
      GlucoseRecord.find(query).sort({ fecha: -1 }).skip(skip).limit(limit),
      GlucoseRecord.countDocuments(query),
    ]);

    res.json({ records, total, page, pages: Math.ceil(total / limit), limit });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener registros', error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rangoObjetivoMin, rangoObjetivoMax } = req.user;
    const dias = Math.min(90, Math.max(7, parseInt(req.query.dias) || 7));

    const hace90dias = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const [total, ultima, records90] = await Promise.all([
      GlucoseRecord.countDocuments({ userId }),
      GlucoseRecord.findOne({ userId }).sort({ fecha: -1 }),
      GlucoseRecord.find({ userId, fecha: { $gte: hace90dias } }).sort({ fecha: 1 }),
    ]);

    // Promedio semanal (últimos 7 días)
    const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const semana = records90.filter(r => new Date(r.fecha) >= hace7dias);
    const promedioSemanal = semana.length > 0
      ? Math.round(semana.reduce((s, r) => s + r.valor, 0) / semana.length)
      : null;

    // Gráfica para el período seleccionado
    const hacePeriodo = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
    const periodoRecords = records90.filter(r => new Date(r.fecha) >= hacePeriodo);
    const grafica = periodoRecords.map(r => ({
      fecha: r.fecha,
      valor: r.valor,
      estado: calcularEstado(r.valor, rangoObjetivoMin, rangoObjetivoMax),
    }));

    // TIR — Tiempo en rango (últimos 30 días)
    const hace30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const tir30 = records90.filter(r => new Date(r.fecha) >= hace30dias);
    const tir = tir30.length > 0 ? {
      normal: Math.round(tir30.filter(r => r.estado === 'Normal').length / tir30.length * 100),
      bajo:   Math.round(tir30.filter(r => r.estado === 'Bajo').length   / tir30.length * 100),
      alto:   Math.round(tir30.filter(r => r.estado === 'Alto').length   / tir30.length * 100),
      total:  tir30.length,
    } : null;

    // HbA1c estimada (fórmula estándar: (promedio + 46.7) / 28.7)
    // Requiere mínimo 7 lecturas en los últimos 90 días
    let hba1c = null;
    if (records90.length >= 7) {
      const avg = records90.reduce((s, r) => s + r.valor, 0) / records90.length;
      hba1c = ((avg + 46.7) / 28.7).toFixed(1);
    }

    res.json({ total, ultimaMedicion: ultima || null, promedioSemanal, grafica, tir, hba1c, dias });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: err.message });
  }
};

const createRecord = async (req, res) => {
  try {
    const { valor, fecha, nota } = req.body;
    const { rangoObjetivoMin, rangoObjetivoMax } = req.user;

    if (!valor || !fecha)
      return res.status(400).json({ message: 'Valor y fecha son requeridos' });
    if (valor <= 0 || valor > 600)
      return res.status(400).json({ message: 'El valor debe estar entre 1 y 600 mg/dL' });

    const estado = calcularEstado(Number(valor), rangoObjetivoMin, rangoObjetivoMax);
    const record = await GlucoseRecord.create({
      userId: req.user._id,
      valor: Number(valor),
      fecha: new Date(fecha),
      nota,
      estado,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear registro', error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { valor, fecha, nota } = req.body;
    const { rangoObjetivoMin, rangoObjetivoMax } = req.user;

    const record = await GlucoseRecord.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Registro no encontrado' });

    if (valor !== undefined) {
      if (valor <= 0 || valor > 600)
        return res.status(400).json({ message: 'El valor debe estar entre 1 y 600 mg/dL' });
      record.valor  = Number(valor);
      record.estado = calcularEstado(Number(valor), rangoObjetivoMin, rangoObjetivoMax);
    }
    if (fecha !== undefined) record.fecha = new Date(fecha);
    if (nota  !== undefined) record.nota  = nota;

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar registro', error: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await GlucoseRecord.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar registro', error: err.message });
  }
};

module.exports = { getRecords, getStats, createRecord, updateRecord, deleteRecord };
