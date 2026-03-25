import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ConflictError, ValidationError } from '../utils/errors.js';

class AuthService {
  async register(username, email, password) {
    if (!username || !email || !password) {
      throw new ValidationError('Todos os campos são obrigatórios');
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      throw new ConflictError('Email ou nome de usuário já existente');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };
  }

  async login(emailOrUsername, password) {
    if (!emailOrUsername || !password) {
      throw new ValidationError('Email e senha são obrigatórios');
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Credenciais inválidas. Verifique seu e-mail e senha.');
    }

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }
}

export default new AuthService();
