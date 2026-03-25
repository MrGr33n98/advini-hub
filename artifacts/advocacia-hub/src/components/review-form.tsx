import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitReview } from "@/hooks/use-reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";
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
const reviewSchema = z.object({
  clientName: z.string().min(3, "Nome é obrigatório"),
  rating: z.coerce.number().min(1, "Selecione uma nota").max(5),
  caseType: z.enum([
    "trabalhista",
    "civil",
    "criminal",
    "familia",
    "tributario",
    "empresarial",
    "consumidor",
    "previdenciario",
    "outro",
  ]),
  caseOutcome: z.enum([
    "vencido",
    "perdido",
    "acordo",
    "em_andamento",
  ]).nullable().optional(),
  comment: z.string().min(20, "O comentário deve ter no mínimo 20 caracteres"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewForm({ lawyerId, onSuccess }: { lawyerId: number, onSuccess?: () => void }) {
  const { toast } = useToast();
  const mutation = useSubmitReview();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      clientName: "",
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      await mutation.mutateAsync({
        data: {
          lawyerId,
          ...data,
          caseOutcome: data.caseOutcome || undefined,
        }
      });
      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi enviada para moderação e em breve aparecerá no perfil.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Verifique os dados e tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="flex justify-center mb-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-2">
                <FormLabel className="text-center">Sua Nota</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => field.onChange(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${field.value >= star ? 'fill-secondary text-secondary' : 'text-slate-200'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu Nome (Apenas o primeiro nome será público)</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" className="rounded-xl bg-slate-50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="caseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área do Caso</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl bg-slate-50">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="familia">Família</SelectItem>
                    <SelectItem value="empresarial">Empresarial</SelectItem>
                    <SelectItem value="consumidor">Consumidor</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caseOutcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resultado (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl bg-slate-50">
                      <SelectValue placeholder="Como terminou?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vencido">Causa Ganha</SelectItem>
                    <SelectItem value="acordo">Acordo Realizado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="perdido">Causa Perdida</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu Relato</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Como foi o atendimento? O advogado foi atencioso?" 
                  className="rounded-xl bg-slate-50 min-h-[100px] resize-none" 
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
          className="w-full rounded-xl shadow-clay-btn mt-2 h-12"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Enviar Avaliação
        </Button>
      </form>
    </Form>
  );
}
