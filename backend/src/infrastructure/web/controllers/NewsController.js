import { VerifyNewsUseCase } from '../../../application/use-cases/VerifyNewsUseCase.js';
import { GetAnalysisHistoryUseCase } from '../../../application/use-cases/GetAnalysisHistoryUseCase.js';
import { GetAnalysisDetailUseCase } from '../../../application/use-cases/GetAnalysisDetailUseCase.js';
import { MongooseAnalysisRepository } from '../../database/MongooseAnalysisRepository.js';

/**
 * Controller Web: NewsController (Adapter)
 * Traduz requisições HTTP para Casos de Uso.
 */
export class NewsController {
  constructor() {
    this.analysisRepository = new MongooseAnalysisRepository();
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict';
    
    // Instanciar Use Cases
    this.verifyUseCase = new VerifyNewsUseCase({ 
      analysisRepository: this.analysisRepository, 
      mlServiceUrl: this.mlServiceUrl 
    });
    this.historyUseCase = new GetAnalysisHistoryUseCase({ 
      analysisRepository: this.analysisRepository 
    });
    this.detailUseCase = new GetAnalysisDetailUseCase({ 
        analysisRepository: this.analysisRepository 
      });
  }

  /**
   * Endpoint de Verificação
   */
  async verify(req, res, next) {
    try {
      const { text } = req.body;
      const userId = req.user?.userId || null;

      // Validação básica (Security: EXPRESS-INPUT-001)
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'O texto deve ser uma string válida' });
      }

      const result = await this.verifyUseCase.execute({ text, userId });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de Histórico
   */
  async history(req, res, next) {
    try {
      const userId = req.user?.userId; // No Security (ID-SEC-002): Usamos apenas o ID do JWT logado.
      
      const results = await this.historyUseCase.execute({ userId });

      res.status(200).json({
        status: 'success',
        results: results.length,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de Detalhes
   */
  async detail(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const result = await this.detailUseCase.execute({ id, userId });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
