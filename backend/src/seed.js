require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const GlucoseRecord = require('./models/GlucoseRecord');
const Reminder = require('./models/Reminder');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Conectado a MongoDB');

  await User.deleteMany({ email: 'demo@diabetgluc.com' });

  const user = await User.create({
    nombre: 'Demo Usuario',
    email: 'demo@diabetgluc.com',
    password: 'demo1234',
    tipoDiabetes: 'Tipo 2',
    rangoObjetivoMin: 70,
    rangoObjetivoMax: 180,
  });

  const calcEstado = (v) => {
    if (v < 70) return 'Bajo';
    if (v > 180) return 'Alto';
    return 'Normal';
  };

  const now = new Date();
  const registros = [];
  for (let i = 13; i >= 0; i--) {
    const fecha = new Date(now);
    fecha.setDate(fecha.getDate() - i);
    fecha.setHours(8, 0, 0, 0);

    const valoresDia = [
      Math.round(80 + Math.random() * 120),
      Math.round(60 + Math.random() * 130),
    ];

    for (const [idx, valor] of valoresDia.entries()) {
      const f = new Date(fecha);
      f.setHours(idx === 0 ? 8 : 20, 0, 0, 0);
      registros.push({ userId: user._id, valor, fecha: f, estado: calcEstado(valor), nota: '' });
    }
  }

  registros.push({
    userId: user._id,
    valor: 50,
    fecha: new Date(now.setHours(now.getHours() - 2)),
    estado: 'Bajo',
    nota: 'Hipoglucemia de prueba',
  });

  await GlucoseRecord.deleteMany({ userId: user._id });
  await GlucoseRecord.insertMany(registros);

  await Reminder.deleteMany({ userId: user._id });
  await Reminder.insertMany([
    { userId: user._id, tipo: 'Medición', hora: '08:00', dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], activo: true },
    { userId: user._id, tipo: 'Medicamento', hora: '20:00', dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], activo: true },
  ]);

  console.log('Seed completado:');
  console.log('  Email: demo@diabetgluc.com');
  console.log('  Contraseña: demo1234');
  console.log(`  Registros creados: ${registros.length}`);

  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
