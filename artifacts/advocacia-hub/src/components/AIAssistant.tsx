// components/AIAssistant.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Sparkles, 
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from "lucide-react";
import { aiAssistant } from "@/services/ai-assistant";

interface AIAssistantProps {
  onRecommendation?: (lawyerId: number) => void;
}

export function AIAssistant({ onRecommendation }: AIAssistantProps) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const aiResponse = await aiAssistant.analyzeQuery({ question });
      setResponse(aiResponse);
      
      // Add to conversation history
      setConversationHistory(prev => [
        ...prev,
        { question, response: aiResponse, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error("AI Assistant error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleLike = (feedback: 'positive' | 'negative') => {
    // In a real app, this would send feedback to improve the AI
    console.log(`Feedback: ${feedback}`, response);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <CardTitle>Assistente Jurídico AI</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Tire suas dúvidas jurídicas e receba recomendações personalizadas
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Question Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua dúvida jurídica..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAsk} disabled={isLoading || !question.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Response */}
          {response && (
            <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="whitespace-pre-line">{response.answer}</p>
                  
                  {response.sources && response.sources.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">Fontes:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {response.sources.map((source: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {response.nextSteps && response.nextSteps.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">Próximos passos:</h4>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {response.nextSteps.map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleLike('positive')}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Útil
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleLike('negative')}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Não útil
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onRecommendation && onRecommendation(1)}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Recomendar Advogado
                </Button>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico de conversas:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {conversationHistory.slice(-3).map((item, idx) => (
                  <div key={idx} className="text-xs p-2 bg-gray-50 rounded">
                    <div className="font-medium">Q: {item.question.substring(0, 50)}...</div>
                    <div className="text-gray-600">A: {item.response.answer.substring(0, 100)}...</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}