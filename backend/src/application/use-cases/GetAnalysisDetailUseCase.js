/**
 * Caso de Uso: Obter Detalhes da Análise
 * Orquestra a busca de uma análise específica de um usuário.
 */
export class GetAnalysisDetailUseCase {
  constructor({ analysisRepository }) {
    this.analysisRepository = analysisRepository;
  }

  async execute({ id, userId }) {
    if (!id || !userId) {
      throw new Error('O ID da análise e o ID do usuário são obrigatórios');
    }

    // Buscar detalhe via Port (Repositório)
    const analysis = await this.analysisRepository.findById(id, userId);
    if (!analysis) {
        throw new Error('Análise não encontrada ou acesso negado');
    }
    return analysis;
  }
}
