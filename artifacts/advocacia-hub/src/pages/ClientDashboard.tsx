// pages/ClientDashboard.tsx
import { useState } from "react";
import { Layout } from "@/components/layout";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClientMetrics, useClientAppointments, useClientSubscription } from "@/hooks/useDashboard";
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
  Calendar, Clock, MessageSquare, CreditCard, Star, Eye, Phone, Mail,
  MoreHorizontal, Search, RefreshCw, ArrowUpRight, Briefcase, CheckCircle,
  AlertCircle, Heart, UserPlus
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

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'scheduled': 'default', 'confirmed': 'secondary', 'completed': 'outline', 'cancelled': 'destructive',
    'pending': 'default', 'sent': 'secondary', 'delivered': 'outline', 'read': 'secondary',
    'active': 'default', 'trialing': 'secondary', 'canceled': 'destructive', 'past_due': 'destructive'
  };
  return map[status] || 'default';
};

function MetricCard({ title, value, change, icon: Icon }: {
  title: string; value: string | number; change?: string; icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className="text-xs text-muted-foreground mt-1">{change}</p>}
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
// MAIN CLIENT DASHBOARD
// ========================================

export default function ClientDashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: metrics, isLoading: metricsLoading } = useClientMetrics();
  const { data: appointmentsData, isLoading: apptsLoading } = useClientAppointments({ page: 1, per_page: 10 });
  const { data: subscriptionData, isLoading: subLoading } = useClientSubscription();

  if (metricsLoading) return <Layout><DashboardSkeleton /></Layout>;

  const appointments = appointmentsData?.data || [];
  const nextAppointment = metrics?.appointments.next_appointment;
  const subscription = subscriptionData?.subscription;

  return (
    <Layout>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.first_name || 'Cliente'}!</h1>
            <p className="text-gray-600 mt-1">Gerencie seus agendamentos e consultas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button asChild>
              <a href="/buscar">
                <UserPlus className="h-4 w-4 mr-2" />
                Encontrar Advogado
              </a>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Next Appointment Highlight */}
            {nextAppointment && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Calendar className="h-5 w-5" />
                    Próximo Agendamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl bg-blue-200 text-blue-800">
                          {nextAppointment.lawyer_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">{nextAppointment.lawyer_name}</h3>
                        <p className="text-blue-700">{nextAppointment.appointment_type}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          {formatDateTime(nextAppointment.appointment_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusVariant(nextAppointment.status)} className="text-sm">
                        {nextAppointment.status}
                      </Badge>
                      {nextAppointment.meeting_link && (
                        <Button asChild>
                          <a href={nextAppointment.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Entrar na Reunião
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total de Agendamentos"
                value={metrics?.appointments.total || 0}
                change={`${metrics?.appointments.upcoming || 0} futuros`}
                icon={Calendar}
              />
              <MetricCard
                title="Consultas Concluídas"
                value={metrics?.appointments.completed || 0}
                icon={CheckCircle}
              />
              <MetricCard
                title="Mensagens Enviadas"
                value={metrics?.messages.total || 0}
                change={`${metrics?.messages.sent_this_month || 0} este mês`}
                icon={MessageSquare}
              />
              <MetricCard
                title="Plano Atual"
                value={metrics?.subscription.plan || 'Grátis'}
                change={metrics?.subscription.status}
                icon={CreditCard}
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <a href="/buscar">
                      <Search className="h-6 w-6" />
                      <span>Buscar Advogado</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <a href="/favoritos">
                      <Heart className="h-6 w-6" />
                      <span>Favoritos</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <a href="/categorias">
                      <Star className="h-6 w-6" />
                      <span>Categorias</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <a href="/faq">
                      <MessageSquare className="h-6 w-6" />
                      <span>FAQ</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos Recentes</CardTitle>
                <CardDescription>Seu histórico de consultas</CardDescription>
              </CardHeader>
              <CardContent>
                {apptsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />)}
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map(apt => (
                      <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {apt.lawyer.photo_url ? (
                              <AvatarImage src={apt.lawyer.photo_url} />
                            ) : (
                              <AvatarFallback>{apt.lawyer.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{apt.lawyer.name}</p>
                            <p className="text-sm text-gray-500">{apt.appointment_type}</p>
                            <p className="text-xs text-gray-400">{formatDateTime(apt.appointment_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusVariant(apt.status)}>{apt.status}</Badge>
                          {apt.fee_amount && (
                            <p className="text-sm font-medium">{formatCurrency(apt.fee_amount)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum agendamento encontrado</p>
                    <Button className="mt-4" asChild>
                      <a href="/buscar">Encontrar Advogado</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPOINTMENTS TAB */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Agendamentos</CardTitle>
                <CardDescription>Histórico completo de consultas</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por advogado..."
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
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  {apt.lawyer.photo_url ? (
                                    <AvatarImage src={apt.lawyer.photo_url} />
                                  ) : (
                                    <AvatarFallback>{apt.lawyer.name.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <p className="font-medium">{apt.lawyer.name}</p>
                                  <p className="text-sm text-gray-500">{apt.appointment_type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{apt.appointment_type}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">{formatDate(apt.appointment_date)}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(apt.appointment_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                </p>
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
                                    <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Contatar Advogado</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {apt.status === 'scheduled' && (
                                      <DropdownMenuItem className="text-red-600">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Cancelar
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>Nenhum agendamento encontrado</p>
                        </TableCell></TableRow>
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
                <CardTitle>Mensagens Enviadas</CardTitle>
                <CardDescription>Histórico de contato com advogados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Funcionalidade em desenvolvimento</p>
                  <p className="text-sm mt-2">Use a API `/api/v1/client/messages` para integrar</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUBSCRIPTION TAB */}
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sua Assinatura</CardTitle>
                <CardDescription>Detalhes do plano atual</CardDescription>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <div className="h-40 bg-gray-100 rounded animate-pulse" />
                ) : subscription ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{subscription.plan.name}</h3>
                        <Badge variant={getStatusVariant(subscription.status)} className="mt-2">
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{formatCurrency(subscription.plan.price_monthly)}</p>
                        <p className="text-sm text-gray-500">/mês</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Início do Período</p>
                        <p className="font-medium">{subscription.current_period_start ? formatDate(subscription.current_period_start) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fim do Período</p>
                        <p className="font-medium">{subscription.current_period_end ? formatDate(subscription.current_period_end) : 'N/A'}</p>
                      </div>
                      {subscription.trial_end && (
                        <div>
                          <p className="text-sm text-gray-500">Trial Até</p>
                          <p className="font-medium">{formatDate(subscription.trial_end)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Cancelamento Automático</p>
                        <p className="font-medium">{subscription.cancel_at_period_end ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Atualizar Plano
                      </Button>
                      <Button variant="outline" className="text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancelar Assinatura
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma Assinatura</h3>
                    <p className="text-gray-500 mb-4">Você está no plano gratuito</p>
                    <Button asChild>
                      <a href="/precos">Ver Planos Disponíveis</a>
                    </Button>
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
