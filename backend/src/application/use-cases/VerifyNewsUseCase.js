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

    // 1. Chamar o serviço de ML
    let mlData;
    try {
      const response = await axios.post(this.mlServiceUrl, { text }, { timeout: 15000 });
      mlData = response.data;
    } catch (error) {
      console.error(`ERROR ML_SERVICE: ${error.message}`);
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new Error('O serviço de inteligência artificial está temporariamente offline ou demorou demais para responder.');
      }
      throw new Error(`Falha na comunicação com a IA: ${error.message}`);
    }

    const { verdict, explanation_natural: explanation, keywords } = mlData;

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
