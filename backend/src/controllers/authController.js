const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { nombre, email, password, tipoDiabetes } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });

    if (password.length < 8)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'El email ya está registrado' });

    const user = await User.create({ nombre, email, password, tipoDiabetes });
    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = generateToken(user._id);
    const userObj = user.toJSON();

    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'El email es requerido' });

    const user = await User.findOne({ email });

    // Respuesta genérica por seguridad
    if (!user) {
      return res.json({ message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    // En producción, aquí se enviaría el email con resetUrl
    console.log(`[RESET] Enlace para ${email}: ${resetUrl}`);

    res.json({
      message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      // Solo en demo — en producción eliminar esta línea y enviar por email
      resetUrl,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar la solicitud', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res.status(400).json({ message: 'Token y contraseña son requeridos' });

    if (password.length < 8)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'El enlace es inválido o ha expirado' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al restablecer la contraseña', error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
