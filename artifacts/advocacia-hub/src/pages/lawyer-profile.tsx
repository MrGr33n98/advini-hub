import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { useGetLawyer } from "@/hooks/use-lawyers";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Briefcase, GraduationCap, CheckCircle2, AlertCircle, Building2, Languages, Globe, Phone, FileText } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { VerifiedBadge } from "@/components/verified-badge";
import { SpecialtyBadge } from "@/components/specialty-badge";
import { ContactForm } from "@/components/contact-form";
import { ReviewCard } from "@/components/review-card";
import { ReviewForm } from "@/components/review-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function LawyerProfile() {
  const { id } = useParams();
  const lawyerId = id ? parseInt(id, 10) : 0;
  
  const { data: lawyer, isLoading, isError } = useGetLawyer(lawyerId, {
    query: {
      enabled: !!lawyerId
    }
  });

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-[400px] w-full rounded-3xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[600px] lg:col-span-2 rounded-3xl" />
            <Skeleton className="h-[500px] rounded-3xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !lawyer) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Perfil não encontrado</h1>
          <p className="text-slate-500 mb-8">O advogado que você está procurando não existe ou o perfil foi removido.</p>
        </div>
      </Layout>
    );
  }

  const photoUrl = lawyer.photoUrl || `${import.meta.env.BASE_URL}images/lawyer-placeholder-1.png`;

  return (
    <Layout>
      {/* Profile Header */}
      <div className="bg-slate-900 text-white relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-800">
                <img src={photoUrl} alt={lawyer.fullName} className="w-full h-full object-cover" />
              </div>
              {lawyer.isVerified && (
                <div className="absolute -bottom-3 -right-3 bg-slate-900 rounded-full p-1 border-2 border-white/10">
                  <VerifiedBadge showText={false} className="py-2 px-2" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold">{lawyer.fullName}</h1>
                <span className="text-sm font-medium bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                  OAB/{lawyer.oabState} {lawyer.oabNumber}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm mb-6">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{lawyer.city}, {lawyer.state}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{lawyer.yearsExperience} anos de exp.</span>
                </div>
                {lawyer.office && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>{lawyer.office.tradeName}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {lawyer.specialties.map(spec => (
                  <span key={spec.id} className="bg-primary/20 text-primary-foreground border border-primary/30 px-3 py-1 rounded-lg text-sm font-medium">
                    {spec.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:text-right bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm w-full md:w-auto">
              <div className="mb-2">
                <span className="text-slate-400 text-sm block">Avaliação Geral</span>
                <div className="flex items-center md:justify-end gap-2 mt-1">
                  <span className="text-3xl font-bold text-white">{lawyer.avgRating.toFixed(1)}</span>
                  <StarRating rating={lawyer.avgRating} showCount={false} size="lg" />
                </div>
              </div>
              <p className="text-sm text-slate-400">{lawyer.totalReviews} avaliações de clientes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Card */}
            <div className="bg-white rounded-3xl p-8 shadow-clay-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Sobre o Profissional
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p className="whitespace-pre-line">{lawyer.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
                {lawyer.languages && lawyer.languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                      <Languages className="w-4 h-4 text-slate-400" />
                      Idiomas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lawyer.languages.map(lang => (
                        <span key={lang} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-md text-sm border border-slate-200">{lang}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {lawyer.hourlyRateMin && (
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      Valores de Consulta
                    </h3>
                    <p className="text-slate-600 font-medium">
                      A partir de R$ {lawyer.hourlyRateMin}
                      {lawyer.hourlyRateMax && ` até R$ ${lawyer.hourlyRateMax}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-8 shadow-clay-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    Avaliações
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">O que os clientes dizem sobre {lawyer.fullName}</p>
                </div>
                
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="shadow-sm rounded-xl font-medium">
                      Avaliar Advogado
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white p-0 overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b border-slate-100">
                      <DialogTitle className="text-xl">Avaliar Profissional</DialogTitle>
                      <DialogDescription className="mt-2">
                        Compartilhe sua experiência com {lawyer.fullName}. Isso ajuda outras pessoas a encontrarem bons profissionais.
                      </DialogDescription>
                    </div>
                    <div className="p-6">
                      <ReviewForm 
                        lawyerId={lawyer.id} 
                        onSuccess={() => setReviewDialogOpen(false)} 
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {lawyer.recentReviews && lawyer.recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {lawyer.recentReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <p className="text-slate-500 mb-4">Este profissional ainda não possui avaliações visíveis.</p>
                  <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                    Seja o primeiro a avaliar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-clay border border-slate-100 sticky top-28 overflow-hidden">
              <div className="p-6 bg-primary/5 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Entre em Contato</h3>
                <p className="text-sm text-slate-600 mt-1">Envie uma mensagem direta para solicitar atendimento ou tirar dúvidas.</p>
              </div>
              
              <div className="p-6">
                <ContactForm lawyerId={lawyer.id} />
              </div>

              {/* Additional Contact Info if available */}
              {(lawyer.phone || lawyer.website) && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-sm space-y-3">
                  {lawyer.phone && (
                    <div className="flex items-center text-slate-600">
                      <Phone className="w-4 h-4 mr-3 text-slate-400" />
                      {lawyer.phone}
                    </div>
                  )}
                  {lawyer.website && (
                    <div className="flex items-center text-slate-600">
                      <Globe className="w-4 h-4 mr-3 text-slate-400" />
                      <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visitar Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
