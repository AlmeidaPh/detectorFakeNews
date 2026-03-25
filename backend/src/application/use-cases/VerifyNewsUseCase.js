import { Analysis } from '../../domain/entities/Analysis.js';
import axios from 'axios';

/**
 * Caso de Uso: Verificar Notícia
 * Orquestra a interação com o ML e a persistência.
 */
export class VerifyNewsUseCase {
  constructor({ analysisRepository, mlServiceUrl }) {
    this.analysisRepository = analysisRepository;
    this.mlServiceUrl = mlServiceUrl;
  }

  async execute({ text, userId = null }) {
    if (!text || text.trim().length < 10) {
      throw new Error('O texto da análise deve ter pelo menos 10 caracteres');
    }

    // 1. Chamar o serviço de ML (Poderia ser um Port separado, mas deixamos aqui por enquanto)
    const response = await axios.post(this.mlServiceUrl, { text });
    const { verdict, explanation_natural: explanation, keywords } = response.data;

    // 2. Criar a entidade de Domínio
    const analysis = new Analysis({
      userId,
      text,
      verdict,
      explanation,
      keywords
    });

    // 3. Persistir se houver usuário autenticado
    if (userId) {
      await this.analysisRepository.save(analysis);
    }

    return analysis;
  }
}
