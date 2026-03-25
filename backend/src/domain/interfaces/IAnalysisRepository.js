/**
 * Interface do Repositório de Análises (Port)
 */
export class IAnalysisRepository {
  async save(analysis) { throw new Error('Método não implementado'); }
  async findByUserId(userId) { throw new Error('Método não implementado'); }
  async findById(id, userId) { throw new Error('Método não implementado'); }
}
