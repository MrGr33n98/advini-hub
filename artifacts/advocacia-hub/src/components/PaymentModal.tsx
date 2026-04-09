// components/PaymentModal.tsx
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { Appointment } from "@/types";

interface PaymentModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentId: string) => void;
}

export function PaymentModal({ 
  appointment, 
  isOpen, 
  onClose, 
  onPaymentSuccess 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'bank_transfer'>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment success
      onPaymentSuccess('pay_' + Math.random().toString(36).substr(2, 9));
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento da Consulta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes da Consulta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tipo de Serviço:</span>
                <Badge variant="secondary">{appointment.service_type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data:</span>
                <span className="text-sm">
                  {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Horário:</span>
                <span className="text-sm">
                  {new Date(appointment.appointment_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valor:</span>
                <span className="text-lg font-bold text-green-600">
                  R$ {appointment.fee_amount?.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-medium">Método de Pagamento</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('credit_card')}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Cartão
              </Button>
              <Button
                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('pix')}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                PIX
              </Button>
              <Button
                variant={paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('bank_transfer')}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                TED
              </Button>
            </div>
          </div>

          {paymentMethod === 'credit_card' && (
            <div className="space-y-3">
              <h3 className="font-medium">Dados do Cartão</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Número do cartão"
                  className="w-full p-2 border rounded-md"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="p-2 border rounded-md"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="p-2 border rounded-md"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Titular do cartão"
                  className="w-full p-2 border rounded-md"
                  value={cardDetails.holder}
                  onChange={(e) => setCardDetails({...cardDetails, holder: e.target.value})}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div className="text-center py-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Chave PIX: contato@advindex.com.br</p>
              <p className="text-xs text-gray-500 mt-2">Código copia e cola será gerado após confirmação</p>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              `Pagar R$ ${appointment.fee_amount?.toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}