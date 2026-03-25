import mongoose from 'mongoose';

/**
 * Modelo de Usuário do Scandit.AI
 * Inclui validações avançadas e segurança de segurança (password hidden).
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'Username deve ter pelo menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um e-mail válido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    select: false 
  }
}, {
  timestamps: true 
});


export default mongoose.model('User', UserSchema);