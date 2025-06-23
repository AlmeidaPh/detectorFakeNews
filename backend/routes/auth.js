const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

// Helper para formatar erros de validação
const formatValidationErrors = (errors) => {
  return errors.array().map(err => ({ 
    msg: err.msg,
    param: err.param,
    location: err.location
  }));
};

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    check('name', 'Nome é obrigatório').not().isEmpty().trim().escape(),
    check('email', 'Por favor inclua um email válido').isEmail().normalizeEmail(),
    check('username', 'Nome de usuário deve ter entre 4 e 20 caracteres')
      .isLength({ min: 4, max: 20 })
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Nome de usuário só pode conter letras, números e underscores'),
    check('password', 'Por favor insira uma senha com 8 ou mais caracteres')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage('Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: formatValidationErrors(errors) 
      });
    }

    const { name, email, username, password } = req.body;

    try {
      // Verifica se usuário já existe
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).json({ 
          success: false,
          errors: [{ msg: 'Usuário já existe com este email ou nome de usuário' }] 
        });
      }

      // Cria novo usuário
      user = new User({ 
        name, 
        email, 
        username, 
        password 
      });

      await user.save();

      // Cria token JWT
      const payload = { 
        user: { 
          id: user.id,
          username: user.username
        } 
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) {
            console.error('Erro ao gerar token JWT:', err.message);
            return res.status(500).json({ 
              success: false,
              msg: 'Erro ao gerar token de autenticação' 
            });
          }
          
          res.status(201).json({ 
            success: true,
            token,
            user: {
              id: user._id,
              username: user.username,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt
            }
          });
        }
      );
    } catch (err) {
      console.error('Erro no registro:', err.message);
      res.status(500).json({ 
        success: false,
        msg: 'Erro no servidor ao registrar usuário' 
      });
    }
  }
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    check('emailOrUsername', 'Por favor insira um email ou nome de usuário')
      .not().isEmpty()
      .trim()
      .escape(),
    check('password', 'Senha é obrigatória').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: formatValidationErrors(errors) 
      });
    }

    const { emailOrUsername, password } = req.body;

    try {
      // Busca usuário por email ou username
      const user = await User.findOne({
        $or: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }).select('+password');

      if (!user) {
        return res.status(400).json({ 
          success: false,
          errors: [{ msg: 'Credenciais inválidas' }] 
        });
      }

      // Verifica senha
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          errors: [{ msg: 'Credenciais inválidas' }] 
        });
      }

      // Cria token JWT
      const payload = { 
        user: { 
          id: user.id,
          username: user.username
        } 
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) {
            console.error('Erro ao gerar token JWT:', err.message);
            return res.status(500).json({ 
              success: false,
              msg: 'Erro ao gerar token de autenticação' 
            });
          }
          
          res.json({ 
            success: true,
            token,
            user: {
              id: user._id,
              username: user.username,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt
            }
          });
        }
      );
    } catch (err) {
      console.error('Erro no login:', err.message);
      res.status(500).json({ 
        success: false,
        msg: 'Erro no servidor ao autenticar usuário' 
      });
    }
  }
);

module.exports = router;