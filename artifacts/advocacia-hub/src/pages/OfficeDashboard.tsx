// pages/OfficeDashboard.tsx
import { useState } from "react";
import { Layout } from "@/components/layout";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOfficeMetrics, useOfficeLawyers, useOfficeCampaigns, useOfficeRevenue } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp, Users, Calendar, DollarSign, Target, Star, Eye,
  MoreHorizontal, Search, RefreshCw, ArrowUpRight, MapPin, Briefcase,
  Megaphone, BarChart3, Download, ExternalLink
} from "lucide-react";

// ========================================
// UTILITY FUNCTIONS
// ========================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'active': 'default', 'paused': 'secondary', 'completed': 'outline', 
    'cancelled': 'destructive', 'draft': 'secondary', 'pending_approval': 'default'
  };
  return map[status] || 'default';
};

// ========================================
// METRIC CARD COMPONENT
// ========================================

function MetricCard({ title, value, change, icon: Icon, trend }: {
  title: string; value: string | number; change?: string; icon: any; trend?: 'up' | 'down';
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> : null}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}><CardContent className="p-6"><div className="h-20 bg-gray-200 rounded" /></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-6"><div className="h-64 bg-gray-200 rounded" /></CardContent></Card>
    </div>
  );
}

// ========================================
// MAIN OFFICE DASHBOARD
// ========================================

export default function OfficeDashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: metrics, isLoading: metricsLoading } = useOfficeMetrics();
  const { data: lawyersData, isLoading: lawyersLoading } = useOfficeLawyers({ page: 1, per_page: 10 });
  const { data: campaignsData, isLoading: campaignsLoading } = useOfficeCampaigns({ page: 1, per_page: 5 });
  const { data: revenueData, isLoading: revenueLoading } = useOfficeRevenue();

  if (metricsLoading) return <Layout><DashboardSkeleton /></Layout>;

  const lawyers = lawyersData?.data || [];
  const campaigns = campaignsData?.data || [];

  return (
    <Layout>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{metrics?.office.name || 'Escritório'}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {metrics?.office.city}, {metrics?.office.state}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="lawyers">Advogados</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Office Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Escritório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Total de Advogados</p>
                    <p className="text-2xl font-bold">{metrics?.office.total_lawyers || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Advogados Ativos</p>
                    <p className="text-2xl font-bold">{metrics?.office.active_lawyers || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experiência Média</p>
                    <p className="text-2xl font-bold">{metrics?.lawyers.avg_experience || 0} anos</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Advogados Verificados</p>
                    <p className="text-2xl font-bold">{metrics?.lawyers.verified || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Agendamentos"
                value={metrics?.appointments.total || 0}
                change={`${metrics?.appointments.this_month || 0} este mês`}
                icon={Calendar}
                trend="up"
              />
              <MetricCard
                title="Leads Totais"
                value={metrics?.leads.total || 0}
                change={`+${metrics?.leads.new_this_week || 0} esta semana`}
                icon={Target}
                trend="up"
              />
              <MetricCard
                title="Receita Mensal"
                value={formatCurrency(metrics?.revenue.monthly || 0)}
                change={`Anual: ${formatCurrency(metrics?.revenue.yearly || 0)}`}
                icon={DollarSign}
                trend="up"
              />
              <MetricCard
                title="Campanhas Ativas"
                value={metrics?.campaigns.active || 0}
                change={`${metrics?.campaigns.total_impressions?.toLocaleString() || 0} impressões`}
                icon={Megaphone}
                trend="up"
              />
            </div>

            {/* Top Lawyers & Campaigns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Lawyers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Advogados do Escritório
                  </CardTitle>
                  <CardDescription>Performance individual</CardDescription>
                </CardHeader>
                <CardContent>
                  {lawyersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                  ) : lawyers.length > 0 ? (
                    <div className="space-y-3">
                      {lawyers.slice(0, 5).map(lawyer => (
                        <div key={lawyer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{lawyer.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{lawyer.full_name}</p>
                              <p className="text-xs text-gray-500">{lawyer.oab_number}/{lawyer.oab_state}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium">{lawyer.avg_rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">{lawyer.appointments_count} agendamentos</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum advogado cadastrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Campanhas Patrocinadas
                  </CardTitle>
                  <CardDescription>Performance das campanhas</CardDescription>
                </CardHeader>
                <CardContent>
                  {campaignsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                  ) : campaigns.length > 0 ? (
                    <div className="space-y-3">
                      {campaigns.slice(0, 5).map(campaign => (
                        <div key={campaign.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">{campaign.campaign_name}</p>
                              <p className="text-xs text-gray-500">{campaign.campaign_type}</p>
                            </div>
                            <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <p className="text-gray-500">Impressões</p>
                              <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Cliques</p>
                              <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">CTR</p>
                              <p className="font-medium">{campaign.ctr}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Gasto</p>
                              <p className="font-medium">{formatCurrency(campaign.budget_spent)}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Orçamento</span>
                              <span>{Math.round((campaign.budget_spent / campaign.budget_total) * 100)}%</span>
                            </div>
                            <Progress value={(campaign.budget_spent / campaign.budget_total) * 100} className="h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma campanha ativa</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LAWYERS TAB */}
          <TabsContent value="lawyers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Advogados do Escritório</CardTitle>
                    <CardDescription>Gestão da equipe</CardDescription>
                  </div>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Adicionar Advogado
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar advogado..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Advogado</TableHead>
                        <TableHead>OAB</TableHead>
                        <TableHead>Experiência</TableHead>
                        <TableHead>Especialidades</TableHead>
                        <TableHead>Avaliação</TableHead>
                        <TableHead>Agendamentos</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lawyersLoading ? (
                        <TableRow><TableCell colSpan={8} className="text-center py-8">Carregando...</TableCell></TableRow>
                      ) : lawyers.length > 0 ? (
                        lawyers.map(lawyer => (
                          <TableRow key={lawyer.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{lawyer.full_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{lawyer.full_name}</p>
                                  <p className="text-sm text-gray-500">{lawyer.city}, {lawyer.state}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{lawyer.oab_number}/{lawyer.oab_state}</TableCell>
                            <TableCell className="text-sm">{lawyer.years_experience} anos</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {lawyer.specialties.slice(0, 2).map(s => (
                                  <Badge key={s.id} variant="outline" className="text-xs">{s.name}</Badge>
                                ))}
                                {lawyer.specialties.length > 2 && (
                                  <Badge variant="outline" className="text-xs">+{lawyer.specialties.length - 2}</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{lawyer.avg_rating}</span>
                                <span className="text-xs text-gray-500">({lawyer.total_reviews})</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{lawyer.appointments_count}</TableCell>
                            <TableCell className="text-center">{lawyer.leads_count}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Ver Perfil</DropdownMenuItem>
                                  <DropdownMenuItem><Briefcase className="h-4 w-4 mr-2" />Agendamentos</DropdownMenuItem>
                                  <DropdownMenuItem><Target className="h-4 w-4 mr-2" />Leads</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem><ExternalLink className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">Nenhum advogado encontrado</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPOINTMENTS TAB */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos do Escritório</CardTitle>
                <CardDescription>Todos os agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4 opacity-30" />
                  <p>Funcionalidade em desenvolvimento</p>
                  <p className="text-sm mt-2">Use a API `/api/v1/office/appointments` para integrar</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CAMPAIGNS TAB */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Campanhas Patrocinadas</CardTitle>
                    <CardDescription>Gestão de marketing</CardDescription>
                  </div>
                  <Button>
                    <Megaphone className="h-4 w-4 mr-2" />
                    Nova Campanha
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                  ) : campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                      <div key={campaign.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{campaign.campaign_name}</h4>
                            <p className="text-sm text-gray-500">{campaign.campaign_type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Orçamento</p>
                            <p className="font-medium">{formatCurrency(campaign.budget_total)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Gasto</p>
                            <p className="font-medium">{formatCurrency(campaign.budget_spent)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Impressões</p>
                            <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Cliques</p>
                            <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">CTR</p>
                            <p className="font-medium">{campaign.ctr}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Conversões</p>
                            <p className="font-medium">{campaign.conversions}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Orçamento Utilizado</span>
                            <span>{Math.round((campaign.budget_spent / campaign.budget_total) * 100)}%</span>
                          </div>
                          <Progress value={(campaign.budget_spent / campaign.budget_total) * 100} className="h-2" />
                        </div>
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                          <span>Início: {formatDate(campaign.start_date)}</span>
                          {campaign.end_date && <span>Fim: {formatDate(campaign.end_date)}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma campanha encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REVENUE TAB */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Receita Mensal"
                value={formatCurrency(metrics?.revenue.monthly || 0)}
                icon={DollarSign}
                trend="up"
              />
              <MetricCard
                title="Receita Anual"
                value={formatCurrency(metrics?.revenue.yearly || 0)}
                icon={TrendingUp}
                trend="up"
              />
              <MetricCard
                title="Ticket Médio"
                value={formatCurrency(
                  metrics?.appointments.total ? 
                    (metrics.revenue.yearly / metrics.appointments.total) : 0
                )}
                icon={BarChart3}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Advogado</CardTitle>
                <CardDescription>Performance individual</CardDescription>
              </CardHeader>
              <CardContent>
                {lawyersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
                  </div>
                ) : lawyers.length > 0 ? (
                  <div className="space-y-3">
                    {lawyers.map(lawyer => (
                      <div key={lawyer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{lawyer.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lawyer.full_name}</p>
                            <p className="text-xs text-gray-500">{lawyer.appointments_count} agendamentos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(lawyer.appointments_count * 250)}</p>
                          <p className="text-xs text-gray-500">estimado</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Sem dados de receita</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
