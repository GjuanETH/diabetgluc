const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String, enum: ['Medicamento', 'Medición', 'Otro'], required: true },
    hora: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
    dias: {
      type: [String],
      enum: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      required: true,
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
