// pages/LawyerDashboard.tsx
import { useState } from "react";
import { Layout } from "@/components/layout";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDashboardMetrics, useLawyerLeads, useLawyerAppointments, useLawyerMessages } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp, TrendingDown, Users, Calendar, MessageSquare, DollarSign,
  Target, Star, Eye, Phone, Mail, MapPin, Briefcase, MoreHorizontal,
  Search, Filter, Download, RefreshCw, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle
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

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  if (score >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'new': 'default', 'contacted': 'secondary', 'qualified': 'default',
    'proposal_sent': 'secondary', 'negotiation': 'default', 'converted': 'outline', 'lost': 'destructive',
    'scheduled': 'default', 'confirmed': 'secondary', 'completed': 'outline', 'cancelled': 'destructive',
    'pending': 'default', 'sent': 'secondary', 'delivered': 'outline', 'read': 'secondary'
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
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> : 
              trend === 'down' ? <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" /> : null}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ========================================
// LOADING SKELETON
// ========================================

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
// MAIN LAWYER DASHBOARD
// ========================================

export default function LawyerDashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const { data: leadsData, isLoading: leadsLoading } = useLawyerLeads({ page: 1, per_page: 10 });
  const { data: appointmentsData, isLoading: apptsLoading } = useLawyerAppointments({ page: 1, per_page: 5 });
  const { data: messagesData, isLoading: messagesLoading } = useLawyerMessages({ page: 1, per_page: 5 });

  if (metricsLoading) return <Layout><DashboardSkeleton /></Layout>;
  if (metricsError) return <Layout><div className="p-8 text-center text-red-600">Erro ao carregar dashboard</div></Layout>;

  const leads = leadsData?.data || [];
  const appointments = appointmentsData?.data || [];
  const messages = messagesData?.data || [];

  return (
    <Layout>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard do Advogado</h1>
            <p className="text-gray-600 mt-1">Visão geral da sua prática jurídica</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total de Leads"
                value={metrics?.leads.total || 0}
                change={`+${metrics?.leads.new_this_week || 0} esta semana`}
                icon={Target}
                trend="up"
              />
              <MetricCard
                title="Taxa de Conversão"
                value={`${metrics?.leads.conversion_rate || 0}%`}
                change={`${metrics?.leads.converted || 0} convertidos`}
                icon={TrendingUp}
                trend="up"
              />
              <MetricCard
                title="Agendamentos"
                value={metrics?.appointments.upcoming || 0}
                change={`${metrics?.appointments.completed_this_month || 0} concluídos este mês`}
                icon={Calendar}
                trend="up"
              />
              <MetricCard
                title="Receita Estimada"
                value={formatCurrency(metrics?.revenue.estimated_this_month || 0)}
                change={`Total: ${formatCurrency(metrics?.revenue.estimated_total || 0)}`}
                icon={DollarSign}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Visualizações do Perfil"
                value={metrics?.profile.views || 0}
                icon={Eye}
              />
              <MetricCard
                title="Contatos este Mês"
                value={metrics?.profile.contacts_this_month || 0}
                icon={Phone}
              />
              <MetricCard
                title="Avaliação Média"
                value={`${metrics?.profile.avg_rating || 0}/5`}
                change={`${metrics?.profile.total_reviews || 0} avaliações`}
                icon={Star}
                trend="up"
              />
              <MetricCard
                title="Mensagens Não Lidas"
                value={metrics?.messages.unread || 0}
                change={`${metrics?.messages.this_week || 0} esta semana`}
                icon={MessageSquare}
                trend={metrics?.messages.unread ? 'down' : 'up'}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximos Agendamentos
                  </CardTitle>
                  <CardDescription>Seus compromissos futuros</CardDescription>
                </CardHeader>
                <CardContent>
                  {apptsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.slice(0, 5).map(apt => (
                        <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{apt.client_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{apt.client_name}</p>
                              <p className="text-xs text-gray-500">{apt.appointment_type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatDate(apt.appointment_date)}</p>
                            <Badge variant={getStatusVariant(apt.status)} className="text-xs">{apt.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum agendamento próximo</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Mensagens Recentes
                  </CardTitle>
                  <CardDescription>Últimas mensagens de clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.slice(0, 5).map(msg => (
                        <div key={msg.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">{msg.client_name}</p>
                              <p className="text-xs text-gray-500">{msg.client_email}</p>
                            </div>
                            <Badge variant={getStatusVariant(msg.status)} className="text-xs">{msg.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{msg.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatDateTime(msg.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma mensagem recente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LEADS TAB */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Gestão de Leads</CardTitle>
                    <CardDescription>Acompanhe e gerencie seus leads</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select className="border rounded-md px-3 py-2 text-sm">
                    <option value="all">Todos os Status</option>
                    <option value="new">Novo</option>
                    <option value="contacted">Contatado</option>
                    <option value="qualified">Qualificado</option>
                    <option value="converted">Convertido</option>
                  </select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fonte</TableHead>
                        <TableHead>Interesse</TableHead>
                        <TableHead>Valor Est.</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadsLoading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
                      ) : leads.length > 0 ? (
                        leads.map(lead => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{lead.name}</p>
                                  <p className="text-sm text-gray-500">{lead.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(lead.score)}>{lead.score}/100</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{lead.source}</TableCell>
                            <TableCell className="text-sm">{lead.specialty_interest || '-'}</TableCell>
                            <TableCell className="font-medium">
                              {lead.estimated_case_value ? formatCurrency(lead.estimated_case_value) : '-'}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Ver Detalhes</DropdownMenuItem>
                                  <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Enviar Email</DropdownMenuItem>
                                  <DropdownMenuItem><Phone className="h-4 w-4 mr-2" />Ligar</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem><CheckCircle className="h-4 w-4 mr-2" />Marcar Convertido</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">Nenhum lead encontrado</TableCell></TableRow>
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
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>Gerencie seus compromissos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Honorários</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apptsLoading ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
                      ) : appointments.length > 0 ? (
                        appointments.map(apt => (
                          <TableRow key={apt.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{apt.client_name}</p>
                                <p className="text-sm text-gray-500">{apt.client_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{apt.appointment_type}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">{formatDate(apt.appointment_date)}</p>
                                <p className="text-xs text-gray-500">{new Date(apt.appointment_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                            </TableCell>
                            <TableCell><Badge variant={getStatusVariant(apt.status)}>{apt.status}</Badge></TableCell>
                            <TableCell className="font-medium">{apt.fee_amount ? formatCurrency(apt.fee_amount) : '-'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {apt.meeting_link && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={apt.meeting_link} target="_blank" rel="noopener noreferrer">
                                      <Briefcase className="h-4 w-4 mr-1" />
                                      Reunião
                                    </a>
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem><CheckCircle className="h-4 w-4 mr-2" />Confirmar</DropdownMenuItem>
                                    <DropdownMenuItem><AlertCircle className="h-4 w-4 mr-2" />Cancelar</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Nenhum agendamento encontrado</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Caixa de Entrada</CardTitle>
                <CardDescription>Mensagens de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map(msg => (
                      <div key={msg.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{msg.client_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{msg.client_name}</p>
                              <p className="text-sm text-gray-500">{msg.client_email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(msg.status)}>{msg.status}</Badge>
                            <span className="text-xs text-gray-400">{formatDateTime(msg.created_at)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-3 line-clamp-2">{msg.message}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm"><Mail className="h-4 w-4 mr-2" />Responder</Button>
                          <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 mr-2" />Marcar como Lida</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma mensagem encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Seu Perfil Público</CardTitle>
                  <CardDescription>Como os clientes veem você</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-2xl">{user?.first_name?.charAt(0) || 'A'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                        <Badge className="mt-2">Advogado Verificado</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Avaliação</p>
                        <p className="text-lg font-bold flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {metrics?.profile.avg_rating || 0}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total de Avaliações</p>
                        <p className="text-lg font-bold">{metrics?.profile.total_reviews || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Visualizações</p>
                        <p className="text-lg font-bold">{metrics?.profile.views || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contatos este Mês</p>
                        <p className="text-lg font-bold">{metrics?.profile.contacts_this_month || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taxa de Conversão</span>
                      <span className="font-bold">{metrics?.leads.conversion_rate || 0}%</span>
                    </div>
                    <Progress value={metrics?.leads.conversion_rate || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Leads Convertidos</span>
                      <span className="font-bold">{metrics?.leads.converted || 0}/{metrics?.leads.total || 0}</span>
                    </div>
                    <Progress value={metrics?.leads.total ? (metrics.leads.converted / metrics.leads.total * 100) : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Agendamentos Concluídos</span>
                      <span className="font-bold">{metrics?.appointments.completed_this_month || 0}</span>
                    </div>
                    <Progress value={metrics?.appointments.total ? (metrics.appointments.completed_this_month / metrics.appointments.total * 100) : 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
