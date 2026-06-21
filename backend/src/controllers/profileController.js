const User = require('../models/User');
const GlucoseRecord = require('../models/GlucoseRecord');

const calcularEstado = (valor, min, max) => {
  if (valor < min) return 'Bajo';
  if (valor > max) return 'Alto';
  return 'Normal';
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { nombre, email, tipoDiabetes, rangoObjetivoMin, rangoObjetivoMax } = req.body;
    const user = req.user;

    if (nombre !== undefined) user.nombre = nombre;
    if (email !== undefined) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'El email ya está en uso' });
      user.email = email;
    }
    if (tipoDiabetes !== undefined) user.tipoDiabetes = tipoDiabetes;

    const oldMin = user.rangoObjetivoMin;
    const oldMax = user.rangoObjetivoMax;

    if (rangoObjetivoMin !== undefined) user.rangoObjetivoMin = Number(rangoObjetivoMin);
    if (rangoObjetivoMax !== undefined) user.rangoObjetivoMax = Number(rangoObjetivoMax);

    await user.save();

    if (
      rangoObjetivoMin !== undefined &&
      rangoObjetivoMax !== undefined &&
      (Number(rangoObjetivoMin) !== oldMin || Number(rangoObjetivoMax) !== oldMax)
    ) {
      const records = await GlucoseRecord.find({ userId: user._id });
      const updates = records.map((r) => ({
        updateOne: {
          filter: { _id: r._id },
          update: { estado: calcularEstado(r.valor, user.rangoObjetivoMin, user.rangoObjetivoMax) },
        },
      }));
      if (updates.length > 0) await GlucoseRecord.bulkWrite(updates);
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
