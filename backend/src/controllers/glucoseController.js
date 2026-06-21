const GlucoseRecord = require('../models/GlucoseRecord');

const calcularEstado = (valor, min, max) => {
  if (valor < min) return 'Bajo';
  if (valor > max) return 'Alto';
  return 'Normal';
};

const getRecords = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      GlucoseRecord.find({ userId: req.user._id }).sort({ fecha: -1 }).skip(skip).limit(limit),
      GlucoseRecord.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      records,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener registros', error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rangoObjetivoMin, rangoObjetivoMax } = req.user;

    const total = await GlucoseRecord.countDocuments({ userId });
    const ultima = await GlucoseRecord.findOne({ userId }).sort({ fecha: -1 });

    const hace7dias = new Date();
    hace7dias.setDate(hace7dias.getDate() - 7);

    const semanaRecords = await GlucoseRecord.find({
      userId,
      fecha: { $gte: hace7dias },
    }).sort({ fecha: 1 });

    const promedioSemanal =
      semanaRecords.length > 0
        ? Math.round(semanaRecords.reduce((sum, r) => sum + r.valor, 0) / semanaRecords.length)
        : null;

    const grafica = semanaRecords.map((r) => ({
      fecha: r.fecha,
      valor: r.valor,
      estado: calcularEstado(r.valor, rangoObjetivoMin, rangoObjetivoMax),
    }));

    res.json({ total, ultimaMedicion: ultima || null, promedioSemanal, grafica });
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
      return res.status(400).json({ message: 'El valor de glucosa debe estar entre 1 y 600 mg/dL' });

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
        return res.status(400).json({ message: 'El valor de glucosa debe estar entre 1 y 600 mg/dL' });
      record.valor = Number(valor);
      record.estado = calcularEstado(Number(valor), rangoObjetivoMin, rangoObjetivoMax);
    }
    if (fecha !== undefined) record.fecha = new Date(fecha);
    if (nota !== undefined) record.nota = nota;

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar registro', error: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await GlucoseRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar registro', error: err.message });
  }
};

module.exports = { getRecords, getStats, createRecord, updateRecord, deleteRecord };
