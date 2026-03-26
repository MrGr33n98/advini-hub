// components/DashboardStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, MessageSquare } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface DashboardStatsProps {
  stats: {
    totalLawyers: number;
    totalAppointments: number;
    totalMessages: number;
    weeklyAppointments: number[];
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  // Prepare chart data for weekly appointments
  const chartData = [
    { day: "Seg", appointments: stats.weeklyAppointments[0] || 0 },
    { day: "Ter", appointments: stats.weeklyAppointments[1] || 0 },
    { day: "Qua", appointments: stats.weeklyAppointments[2] || 0 },
    { day: "Qui", appointments: stats.weeklyAppointments[3] || 0 },
    { day: "Sex", appointments: stats.weeklyAppointments[4] || 0 },
    { day: "Sáb", appointments: stats.weeklyAppointments[5] || 0 },
    { day: "Dom", appointments: stats.weeklyAppointments[6] || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Lawyers Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Advogados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLawyers}</div>
          <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
        </CardContent>
      </Card>

      {/* Total Appointments Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAppointments}</div>
          <p className="text-xs text-muted-foreground">+8% desde o último mês</p>
        </CardContent>
      </Card>

      {/* Total Messages Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">+22% desde o último mês</p>
        </CardContent>
      </Card>

      {/* Weekly Activity Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividade Semanal</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-16 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={4} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="appointments" fill="#3b82f6" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}