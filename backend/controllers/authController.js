import authService from '../services/authService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controller para registro de novos usuários.
 * Agora utiliza o padrão Service Layer para lógica de negócio.
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const result = await authService.register(username, email, password);

  res.status(201).json({
    status: 'success',
    token: result.token,
    user: result.user
  });
});

/**
 * Controller para autenticação.
 */
const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;
  const result = await authService.login(emailOrUsername, password);

  res.status(200).json({
    status: 'success',
    token: result.token,
    user: result.user
  });
});

/**
 * Simulação de logout (pode ser estendido para blacklist no Redis).
 */
const logout = asyncHandler(async (req, res) => {
  // O logout em JWT stateless geralmente é feito limpando o token no frontend,
  // mas podemos manter o endpoint se precisar de lógica de auditoria lateral.
  res.status(200).json({
    status: 'success',
    message: 'Logout realizado com sucesso'
  });
});

export { register, login, logout };