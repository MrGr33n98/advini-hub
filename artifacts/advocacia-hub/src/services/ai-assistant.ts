// services/ai-assistant.ts
// Mock AI Assistant Service for legal queries

interface LegalQuery {
  question: string;
  context?: string;
  category?: string;
}

interface LegalResponse {
  answer: string;
  confidence: number;
  sources: string[];
  nextSteps: string[];
}

class AILegalAssistant {
  private knowledgeBase: Record<string, any>;

  constructor() {
    // Initialize with mock legal knowledge base
    this.knowledgeBase = {
      'divorce': {
        process: 'O divórcio pode ser feito de forma consensual ou litigioso...',
        requirements: ['RG', 'CPF', 'Certidão de casamento'],
        timeline: '30-90 dias',
        cost: 'R$ 1.000 - R$ 5.000'
      },
      'labor': {
        process: 'A reclamação trabalhista deve ser protocolada na vara do trabalho...',
        requirements: ['Carteira de trabalho', 'Holerites', 'CTPS'],
        timeline: '6-18 meses',
        cost: 'Sem custo para o trabalhador'
      },
      'contracts': {
        process: 'A elaboração de contratos deve seguir os princípios da legalidade...',
        requirements: ['Documentos das partes', 'Objeto do contrato'],
        timeline: '1-15 dias',
        cost: 'R$ 500 - R$ 2.000'
      }
    };
  }

  async analyzeQuery(query: LegalQuery): Promise<LegalResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine category based on keywords
    let category = query.category;
    if (!category) {
      if (query.question.toLowerCase().includes('divórcio')) {
        category = 'divorce';
      } else if (query.question.toLowerCase().includes('trabalhista') || query.question.toLowerCase().includes('carteira')) {
        category = 'labor';
      } else if (query.question.toLowerCase().includes('contrato')) {
        category = 'contracts';
      } else {
        category = 'general';
      }
    }

    // Generate response based on category
    const knowledge = this.knowledgeBase[category] || {
      process: 'Para questões jurídicas específicas, recomenda-se consultar um advogado especializado.',
      requirements: ['Documentação pertinente'],
      timeline: 'Variável',
      cost: 'Consultar um advogado'
    };

    return {
      answer: `Com base na sua pergunta "${query.question}", posso informar que: ${knowledge.process} ${knowledge.timeline ? `O processo geralmente leva cerca de ${knowledge.timeline}.` : ''}`,
      confidence: 0.85,
      sources: ['Código Civil Brasileiro', 'Consolidação das Leis do Trabalho', 'Jurisprudência'],
      nextSteps: [
        'Reunir a documentação necessária',
        'Consultar um advogado especializado na área',
        'Agendar uma consulta para análise detalhada'
      ]
    };
  }

  async analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['bom', 'ótimo', 'excelente', 'satisfeito', 'recomendo'];
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'insatisfeito', 'não recomendo', 'problema'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  async classifyReview(review: string): Promise<{ category: string; priority: 'low' | 'medium' | 'high' }> {
    // Classify review based on content
    const categories = ['atendimento', 'competencia', 'valor', 'tempo_resposta', 'outro'];
    let detectedCategory = 'outro';
    
    if (review.toLowerCase().includes('atendimento') || review.toLowerCase().includes('simpatia')) {
      detectedCategory = 'atendimento';
    } else if (review.toLowerCase().includes('competência') || review.toLowerCase().includes('experiência')) {
      detectedCategory = 'competencia';
    } else if (review.toLowerCase().includes('valor') || review.toLowerCase().includes('preço')) {
      detectedCategory = 'valor';
    } else if (review.toLowerCase().includes('resposta') || review.toLowerCase().includes('retorno')) {
      detectedCategory = 'tempo_resposta';
    }
    
    // Determine priority based on sentiment and urgency keywords
    const urgentKeywords = ['urgente', 'emergência', 'preciso', 'imediatamente'];
    const hasUrgent = urgentKeywords.some(keyword => review.toLowerCase().includes(keyword));
    const sentiment = await this.analyzeSentiment(review);
    
    let priority: 'low' | 'medium' | 'high' = 'medium';
    if (hasUrgent || sentiment === 'negative') {
      priority = 'high';
    } else if (sentiment === 'positive') {
      priority = 'low';
    }
    
    return { category: detectedCategory, priority };
  }
}

export const aiAssistant = new AILegalAssistant();