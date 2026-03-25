import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendContactMessage } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
  clientName: z.string().min(3, "Nome completo é obrigatório"),
  clientEmail: z.string().email("E-mail inválido"),
  clientPhone: z.string().optional(),
  caseType: z.string().min(1, "Selecione o tipo de caso"),
  message: z.string().min(20, "A mensagem deve ter no mínimo 20 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm({ lawyerId }: { lawyerId: number }) {
  const { toast } = useToast();
  const mutation = useSendContactMessage();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      caseType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await mutation.mutateAsync({
        data: {
          lawyerId,
          ...data
        }
      });
      setIsSuccess(true);
      toast({
        title: "Mensagem enviada!",
        description: "O advogado receberá seu contato em breve.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-100 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-lg mb-2">Mensagem Enviada</h4>
        <p className="text-sm text-green-700 mb-4">Seu contato foi encaminhado com sucesso para o advogado. Aguarde o retorno.</p>
        <Button variant="outline" className="bg-white" onClick={() => setIsSuccess(false)}>
          Enviar nova mensagem
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" className="rounded-xl bg-slate-50 border-transparent focus-visible:bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
               <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" className="rounded-xl bg-slate-50 border-transparent focus-visible:bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientPhone"
            render={({ field }) => (
               <FormItem>
                <FormLabel>Telefone / WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" className="rounded-xl bg-slate-50 border-transparent focus-visible:bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="caseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Caso</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-transparent focus:bg-white">
                    <SelectValue placeholder="Selecione o assunto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="trabalhista">Direito Trabalhista</SelectItem>
                  <SelectItem value="civil">Direito Civil</SelectItem>
                  <SelectItem value="familia">Direito de Família</SelectItem>
                  <SelectItem value="empresarial">Direito Empresarial</SelectItem>
                  <SelectItem value="consumidor">Direito do Consumidor</SelectItem>
                  <SelectItem value="outro">Outro assunto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua Mensagem</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva brevemente o seu caso para o advogado..." 
                  className="rounded-xl bg-slate-50 border-transparent focus-visible:bg-white min-h-[120px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={mutation.isPending} 
          className="w-full rounded-xl shadow-clay-btn h-12 text-base font-semibold"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Mensagem
            </>
          )}
        </Button>
        <p className="text-xs text-center text-slate-400 mt-2">
          Seus dados estão seguros e serão enviados diretamente ao advogado.
        </p>
      </form>
    </Form>
  );
}
