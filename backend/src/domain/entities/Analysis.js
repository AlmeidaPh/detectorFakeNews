/**
 * Entidade de Domínio: Analysis
 * Representa uma análise de fake news independente de infraestrutura.
 */
export class Analysis {
  constructor({ id, userId, text, verdict, explanation, keywords, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.verdict = verdict;
    this.explanation = explanation;
    this.keywords = keywords;
    this.createdAt = createdAt || new Date();
  }

  static create(data) {
    if (!data.text || data.text.length < 10) {
      throw new Error('O texto da análise deve ter pelo menos 10 caracteres');
    }
    return new Analysis(data);
  }
}
