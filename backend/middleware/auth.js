const jwt = require('jsonwebtoken');
const User = require('./models/User');

module.exports = async function(req, res, next) {
  // Obter token do header
  const token = req.header('x-auth-token');

  // Verificar se não há token
  if (!token) {
    return res.status(401).json({ msg: 'Não há token, autorização negada' });
  }

  // Verificar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token não é válido' });
  }
};