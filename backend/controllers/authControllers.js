import User from '/backEnd/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verifica se usuário existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria novo usuário
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Cria token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      userId: user._id, 
      email: user.email, 
      token,
      username: user.username
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no registro' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verifica senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Cria token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      userId: user._id, 
      email: user.email, 
      token,
      username: user.username
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logout realizado' });
};

export { register, login, logout };