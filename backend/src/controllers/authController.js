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

module.exports = { register, login };
