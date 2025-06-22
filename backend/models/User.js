const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, adicione um nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor, adicione um email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, adicione um email válido'
    ]
  },
  username: {
    type: String,
    required: [true, 'Por favor, adicione um nome de usuário'],
    unique: true,
    minlength: [4, 'Nome de usuário deve ter pelo menos 4 caracteres'],
    maxlength: [20, 'Nome de usuário não pode ter mais de 20 caracteres'],
    match: [/^[a-zA-Z0-9_]+$/, 'Use apenas letras, números e underscores']
  },
  password: {
    type: String,
    required: [true, 'Por favor, adicione uma senha'],
    minlength: [8, 'Senha deve ter pelo menos 8 caracteres'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar senhas
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);