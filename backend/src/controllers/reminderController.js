const Reminder = require('../models/Reminder');

const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener recordatorios', error: err.message });
  }
};

const createReminder = async (req, res) => {
  try {
    const { tipo, hora, dias } = req.body;

    if (!tipo || !hora || !dias || dias.length === 0)
      return res.status(400).json({ message: 'Tipo, hora y al menos un día son requeridos' });

    const reminder = await Reminder.create({ userId: req.user._id, tipo, hora, dias });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear recordatorio', error: err.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Recordatorio no encontrado' });

    const { tipo, hora, dias, activo } = req.body;
    if (tipo !== undefined) reminder.tipo = tipo;
    if (hora !== undefined) reminder.hora = hora;
    if (dias !== undefined) reminder.dias = dias;
    if (activo !== undefined) reminder.activo = activo;

    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar recordatorio', error: err.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!reminder) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json({ message: 'Recordatorio eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar recordatorio', error: err.message });
  }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
