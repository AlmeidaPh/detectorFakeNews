import mongoose from 'mongoose';

/**
 * Modelo de Análise (Histórico) do Scandit.AI
 */
const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uma análise deve pertencer a um usuário']
  },
  text: {
    type: String,
    required: [true, 'O texto analisado é obrigatório'],
    trim: true,
    maxlength: [10000, 'Texto muito longo para análise']
  },
  verdict: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  keywords: {
    type: Map,
    of: Number
  }
}, {
  timestamps: true // Habilita createdAt e updatedAt
});

// Índice para busca rápida de histórico por usuário (ordenado por data descendente)
AnalysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Analysis', AnalysisSchema);
