// components/AppointmentScheduler.tsx
import { useState } from "react";
import { format, addDays, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, User, Mail, Phone, CreditCard } from "lucide-react";
import { Appointment, Lawyer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AppointmentSchedulerProps {
  lawyer: Lawyer;
  onAppointmentScheduled?: (appointment: Appointment) => void;
}

export function AppointmentScheduler({ lawyer, onAppointmentScheduled }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available time slots (every hour from 9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const availableTimeSlots = generateTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to schedule appointment
      const appointmentData = {
        lawyer_id: lawyer.id,
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        appointment_date: selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString(),
        notes: clientInfo.notes,
        service_type: clientInfo.serviceType,
        appointment_type: 'consultation' as const,
        status: 'scheduled' as const,
        fee_amount: 150, // Example fee
      };

      // Mock API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Agendamento realizado com sucesso!");
      
      if (onAppointmentScheduled) {
        onAppointmentScheduled(appointmentData as Appointment);
      }

      // Reset form
      setClientInfo({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        notes: ""
      });
      setSelectedTime("");
    } catch (error) {
      toast.error("Erro ao agendar consulta. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Agendar Consulta com {lawyer.full_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <label className="text-sm font-medium">Data da Consulta</label>
              </div>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => isBefore(date, new Date())}
                initialFocus
                locale={ptBR}
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <label className="text-sm font-medium">Horário</label>
              </div>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <label className="text-sm font-medium">Nome Completo</label>
                </div>
                <Input
                  required
                  placeholder="Seu nome completo"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <label className="text-sm font-medium">Email</label>
                </div>
                <Input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <label className="text-sm font-medium">Telefone (opcional)</label>
                </div>
                <Input
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <label className="text-sm font-medium">Tipo de Serviço</label>
                </div>
                <Select value={clientInfo.serviceType} onValueChange={(value) => setClientInfo({...clientInfo, serviceType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consulta Inicial</SelectItem>
                    <SelectItem value="meeting">Reunião Presencial</SelectItem>
                    <SelectItem value="document_review">Revisão de Documentos</SelectItem>
                    <SelectItem value="hearing">Audiência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <label className="text-sm font-medium">Localização</label>
              </div>
              <p className="text-sm text-muted-foreground">
                {lawyer.city}, {lawyer.state} {lawyer.office ? `- Escritório: ${lawyer.office.trade_name}` : '(Atendimento online)'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <label className="text-sm font-medium">Taxa de Consulta</label>
              </div>
              <p className="text-sm text-muted-foreground">
                R$ 150,00 (será confirmado no próximo passo)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações (opcional)</label>
              <Textarea
                placeholder="Alguma informação adicional que deseja compartilhar..."
                value={clientInfo.notes}
                onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!selectedDate || !selectedTime || isSubmitting}>
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}