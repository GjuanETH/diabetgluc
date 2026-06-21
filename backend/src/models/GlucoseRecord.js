const mongoose = require('mongoose');

const glucoseRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    valor: { type: Number, required: true },
    fecha: { type: Date, required: true },
    nota: { type: String, trim: true },
    estado: { type: String, enum: ['Normal', 'Bajo', 'Alto'], required: true },
  },
  { timestamps: true }
);

glucoseRecordSchema.index({ userId: 1, fecha: -1 });

module.exports = mongoose.model('GlucoseRecord', glucoseRecordSchema);
