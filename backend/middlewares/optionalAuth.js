import jwt from 'jsonwebtoken';

/**
 * Middleware de Autenticação Opcional.
 * Se houver token, identifica o usuário. Se não houver, apenas continua como guest.
 */
export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Se o token for inválido, apenas continuamos como guest, mas poderíamos opcionalmente avisar
    next();
  }
};
