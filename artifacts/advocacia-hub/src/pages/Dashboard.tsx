// pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DashboardStats } from "@/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MessageSquare, 
  User, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";
import { Appointment, ContactMessage } from "@/types";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLawyers: 0,
    totalAppointments: 0,
    totalMessages: 0,
    weeklyAppointments: [0, 0, 0, 0, 0, 0, 0] as number[],
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call to fetch dashboard data
    setTimeout(() => {
      setStats({
        totalLawyers: 127,
        totalAppointments: 89,
        totalMessages: 42,
        weeklyAppointments: [12, 8, 15, 10, 18, 14, 12],
      });
      
      setAppointments([
        {
          id: 1,
          lawyer_id: 1,
          client_name: "Maria Silva",
          client_email: "maria@example.com",
          appointment_date: "2023-06-15T10:00:00Z",
          service_type: "consultation",
          appointment_type: "consultation",
          status: "scheduled",
          fee_amount: 150,
        },
        {
          id: 2,
          lawyer_id: 1,
          client_name: "João Santos",
          client_email: "joao@example.com",
          appointment_date: "2023-06-15T14:30:00Z",
          service_type: "meeting",
          appointment_type: "meeting",
          status: "confirmed",
          fee_amount: 200,
        },
        {
          id: 3,
          lawyer_id: 1,
          client_name: "Ana Costa",
          client_email: "ana@example.com",
          appointment_date: "2023-06-16T09:00:00Z",
          service_type: "document_review",
          appointment_type: "document_review",
          status: "completed",
          fee_amount: 180,
        },
      ]);
      
      setMessages([
        {
          id: 1,
          lawyer_id: 1,
          client_name: "Carlos Oliveira",
          client_email: "carlos@example.com",
          message: "Gostaria de agendar uma consulta para discutir meu caso de divórcio.",
          status: "pending",
        },
        {
          id: 2,
          lawyer_id: 1,
          client_name: "Fernanda Lima",
          client_email: "fernanda@example.com",
          message: "Preciso de orientação sobre direitos trabalhistas.",
          status: "read",
        },
        {
          id: 3,
          lawyer_id: 1,
          client_name: "Roberto Almeida",
          client_email: "roberto@example.com",
          message: "Tenho interesse em contratar seus serviços para um processo civil.",
          status: "sent",
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'pending':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'read':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral da sua plataforma de advocacia</p>
        </div>

        <DashboardStats stats={stats} />

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(appointment.status)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{appointment.client_name}</p>
                            <p className="text-sm text-gray-500">{appointment.service_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.appointment_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{message.client_name}</h4>
                            <Badge variant={getStatusBadgeVariant(message.status)}>
                              {message.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{message.client_email}</p>
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{message.message}</p>
                          <div className="mt-3 flex space-x-2">
                            <Button size="sm">Responder</Button>
                            <Button size="sm" variant="outline">Arquivar</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Dashboard</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Visualize métricas e desempenho da sua plataforma
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}