import { Analysis } from '../../domain/entities/Analysis.js';
import AnalysisModel from '../../../models/Analysis.js';

/**
 * Implementação do repositório usando Mongoose (Adapter)
 */
export class MongooseAnalysisRepository {
  constructor() {
    this.model = AnalysisModel;
  }

  async save(analysisEntity) {
    const data = {
      userId: analysisEntity.userId,
      text: analysisEntity.text,
      verdict: analysisEntity.verdict,
      explanation: analysisEntity.explanation,
      keywords: analysisEntity.keywords,
      createdAt: analysisEntity.createdAt
    };
    
    const saved = await this.model.create(data);
    return this._mapToEntity(saved);
  }

  async findByUserId(userId) {
    const results = await this.model.find({ userId }).sort({ createdAt: -1 }).lean();
    return results.map(this._mapToEntity);
  }

  async findById(id, userId) {
    const result = await this.model.findOne({ _id: id, userId }).lean();
    if (!result) return null;
    return this._mapToEntity(result);
  }

  _mapToEntity(doc) {
    return new Analysis({
      id: doc._id,
      userId: doc.userId,
      text: doc.text,
      verdict: doc.verdict,
      explanation: doc.explanation,
      keywords: doc.keywords,
      createdAt: doc.createdAt
    });
  }
}
