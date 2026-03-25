/**
 * Caso de Uso: Obter Histórico de Análises
 * Orquestra a busca do histórico de análises de um usuário.
 */
export class GetAnalysisHistoryUseCase {
  constructor({ analysisRepository }) {
    this.analysisRepository = analysisRepository;
  }

  async execute({ userId }) {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório');
    }

    // Buscar histórico via Port (Repositório)
    return await this.analysisRepository.findByUserId(userId);
  }
}
