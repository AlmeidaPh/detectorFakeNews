import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Dados recebidos:', { username, email }); // Log para debug

    // Verificação mais detalhada
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos os campos são obrigatórios' 
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email ou nome de usuário já existente' 
      });
    }

    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 12)
    });

    await user.save();
    console.log('Usuário criado no MongoDB:', user); // Confirmação

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro no servidor' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // 1. Verifica se o usuário existe
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    }).select('+password');

    // 2. Compara a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // 3. Gera o token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Resposta com token e dados do usuário (ADICIONE AQUI)
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
        // Adicione outros campos se necessário (ex: role, avatar)
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    const tokenBlacklist = req.app.get('tokenBlacklist') || [];
    tokenBlacklist.push(token);
    req.app.set('tokenBlacklist', tokenBlacklist);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
      logoutTime: new Date(),
      tokenExpiresIn: `${expiresIn} seconds remaining`
    });

  } catch (error) {
    console.error('Erro durante logout:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erro durante o processo de logout' 
    });
  }
};

//falha de segurança abaixo:
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Token gerado:', token); // Verifique se está sendo gerado

export { register, login, logout };