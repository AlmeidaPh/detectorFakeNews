import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Middleware de Autenticação JWT
 * Protege rotas que exigem login.
 */
export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Acesso negado. Token não fornecido ou inválido.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Anexa os dados do usuário ao request para uso posterior nos controllers
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Sessão expirada. Por favor, faça login novamente.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Token inválido.'));
    }
    next(error);
  }
};