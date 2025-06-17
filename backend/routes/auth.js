const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Registrar usuário
router.post(
  '/register',
  [
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor inclua um email válido').isEmail(),
    check('username', 'Nome de usuário deve ter entre 4 e 20 caracteres').isLength({ min: 4, max: 20 }),
    check('password', 'Por favor insira uma senha com 8 ou mais caracteres').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, username, password } = req.body;

    try {
      // Verificar se usuário já existe
      let user = await User.findOne({ $or: [{ email }, { username }] });
      
      if (user) {
        return res.status(400).json({ 
          errors: [{ msg: 'Usuário já existe com este email/nome de usuário' }] 
        });
      }

      user = new User({
        name,
        email,
        username,
        password
      });

      await user.save();

      // Retornar token JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Autenticar usuário e retornar token
router.post(
  '/login',
  [
    check('emailOrUsername', 'Por favor insira um email ou nome de usuário válido').not().isEmpty(),
    check('password', 'Senha é obrigatória').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailOrUsername, password } = req.body;

    try {
      // Verificar se usuário existe por email ou username
      let user = await User.findOne({
        $or: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }).select('+password');

      if (!user) {
        return res.status(400).json({ 
          errors: [{ msg: 'Credenciais inválidas' }] 
        });
      }

      // Verificar senha
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(400).json({ 
          errors: [{ msg: 'Credenciais inválidas' }] 
        });
      }

      // Retornar token JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   GET /api/auth/user
// @desc    Obter dados do usuário autenticado
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;