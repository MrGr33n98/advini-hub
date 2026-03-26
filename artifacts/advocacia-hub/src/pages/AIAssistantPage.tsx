// pages/AIAssistantPage.tsx
import { Layout } from "@/components/Layout";
import { AIAssistant } from "@/components/AIAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  FileText, 
  Users, 
  Calendar,
  TrendingUp
} from "lucide-react";

export default function AIAssistantPage() {
  const handleRecommendation = (lawyerId: number) => {
    console.log(`Recommending lawyer: ${lawyerId}`);
    // In a real app, this would navigate to the lawyer's profile
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assistente Jurídico AI</h1>
              <p className="text-gray-600">Sua inteligência artificial jurídica pessoal</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main AI Assistant */}
          <div className="lg:col-span-2">
            <AIAssistant onRecommendation={handleRecommendation} />
          </div>

          {/* Sidebar with quick stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Consultas respondidas</span>
                    <span className="font-semibold">1,248</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de acerto</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tempo médio resposta</span>
                    <span className="font-semibold">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Satisfação</span>
                    <Badge variant="default">4.8/5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Áreas de Atuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Direito Civil</Badge>
                  <Badge variant="secondary">Direito Trabalhista</Badge>
                  <Badge variant="secondary">Direito Tributário</Badge>
                  <Badge variant="secondary">Direito Penal</Badge>
                  <Badge variant="secondary">Direito Imobiliário</Badge>
                  <Badge variant="secondary">Direito de Família</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  O assistente AI pode recomendar advogados com base em sua consulta
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm">Dr. Carlos Silva</h4>
                    <p className="text-xs text-gray-600">Especialista em Direito Civil</p>
                    <Badge variant="outline" className="mt-1">98% compatibilidade</Badge>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-sm">Dra. Ana Costa</h4>
                    <p className="text-xs text-gray-600">Especialista em Direito Trabalhista</p>
                    <Badge variant="outline" className="mt-1">92% compatibilidade</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos Avançados</h2>
          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Análise de Sentimentos</TabsTrigger>
              <TabsTrigger value="classification">Classificação de Casos</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Sentimentos em Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Nosso sistema analisa automaticamente as avaliações dos clientes para identificar padrões e insights valiosos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Positivas</h4>
                      <p className="text-2xl font-bold text-green-600">78%</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800">Neutras</h4>
                      <p className="text-2xl font-bold text-yellow-600">15%</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800">Negativas</h4>
                      <p className="text-2xl font-bold text-red-600">7%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Classificação de Tipos de Casos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    O sistema categoriza automaticamente os tipos de casos para melhor organização e encaminhamento.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Direito Civil</span>
                      <Badge variant="outline">42% dos casos</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Direito Trabalhista</span>
                      <Badge variant="outline">28% dos casos</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Direito Tributário</span>
                      <Badge variant="outline">18% dos casos</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Outros</span>
                      <Badge variant="outline">12% dos casos</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações Inteligentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Com base na sua consulta, o sistema recomenda os advogados mais adequados para o seu caso.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div className="flex-1">
                        <h4 className="font-medium">Dr. Roberto Almeida</h4>
                        <p className="text-sm text-gray-600">Especialista em Direito Empresarial</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">95% compatibilidade</Badge>
                          <Badge variant="outline">4.9/5 (127 avaliações)</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div className="flex-1">
                        <h4 className="font-medium">Dra. Fernanda Lima</h4>
                        <p className="text-sm text-gray-600">Especialista em Direito de Família</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">91% compatibilidade</Badge>
                          <Badge variant="outline">4.7/5 (89 avaliações)</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}