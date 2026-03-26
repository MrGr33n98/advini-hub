// pages/LawyerProfile.tsx
import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/StarRating";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { AppointmentScheduler } from "@/components/AppointmentScheduler";
import { DocumentManager } from "@/components/DocumentManager";
import { 
  MapPin, 
  Briefcase, 
  Award, 
  Users, 
  Calendar, 
  MessageSquare, 
  Building2,
  Mail,
  Phone,
  Globe
} from "lucide-react";
import { Lawyer, Office, Specialty } from "@/types";

// Mock data for demonstration
const mockLawyer: Lawyer = {
  id: 1,
  full_name: "Dr. Carlos Eduardo Silva",
  oab_number: "MG123456",
  oab_state: "MG",
  city: "Belo Horizonte",
  state: "MG",
  bio: "Especialista em direito civil e empresarial com mais de 15 anos de experiência. Atuo em todo o território nacional com foco em soluções rápidas e eficazes.",
  years_experience: 15,
  hourly_rate_min: 300,
  hourly_rate_max: 800,
  is_verified: true,
  avg_rating: 4.8,
  total_reviews: 127,
  photo_url: "/images/lawyer-placeholder-1.png",
  specialties: [
    { id: 1, name: "Direito Civil", description: "Contratos, obrigações, responsabilidade civil", slug: "direito-civil" },
    { id: 2, name: "Direito Empresarial", description: "Sociedades, falências, recuperações", slug: "direito-empresarial" },
    { id: 3, name: "Direito Tributário", description: "Impostos, taxas, contribuições", slug: "direito-tributario" }
  ],
  office: {
    id: 1,
    trade_name: "Silva & Associados Advogados",
    city: "Belo Horizonte",
    state: "MG",
    lawyer_count: 8,
    logo_url: "/images/office-logo.png"
  },
  has_account: true
};

const mockDocuments = [
  {
    id: "1",
    name: "Contrato de Prestação de Serviços.pdf",
    type: "contract" as const,
    size: "2.4 MB",
    uploadedAt: "2023-06-15T10:30:00Z",
    status: "signed" as const,
    downloadUrl: "#"
  },
  {
    id: "2",
    name: "Parecer Jurídico - Processo 12345.pdf",
    type: "legal_opinion" as const,
    size: "1.8 MB",
    uploadedAt: "2023-06-10T14:20:00Z",
    status: "reviewed" as const,
    downloadUrl: "#"
  }
];

export default function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch lawyer data
    setTimeout(() => {
      setLawyer(mockLawyer);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!lawyer) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Advogado não encontrado</h2>
            <p className="text-gray-600 mt-2">O advogado que você está procurando não existe ou foi removido.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-clay p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={lawyer.photo_url}
                  alt={`Foto de ${lawyer.full_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {lawyer.is_verified && (
                <div className="mt-2 flex justify-center">
                  <VerifiedBadge />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{lawyer.full_name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-semibold text-blue-600">{lawyer.oab_number}/{lawyer.oab_state}</span>
                    <Badge variant="outline">Verificado</Badge>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <StarRating rating={lawyer.avg_rating} totalReviews={lawyer.total_reviews} />
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{lawyer.city}, {lawyer.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{lawyer.years_experience} anos de experiência</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>{lawyer.total_reviews} avaliações</span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700">{lawyer.bio}</p>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {lawyer.specialties.map((specialty) => (
                  <Badge key={specialty.id} variant="secondary">
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office Information */}
        {lawyer.office && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Escritório
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                  {lawyer.office.logo_url ? (
                    <img
                      src={lawyer.office.logo_url}
                      alt={lawyer.office.trade_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400 m-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{lawyer.office.trade_name}</h3>
                  <p className="text-gray-600">{lawyer.office.city}, {lawyer.office.state}</p>
                  <p className="text-sm text-gray-500">{lawyer.office.lawyer_count} advogados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>contato@advogado.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>(31) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span>www.advogado.com.br</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">Agendar Consulta</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <AppointmentScheduler lawyer={lawyer} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentManager 
              documents={mockDocuments}
              onUpload={() => {}}
              onDownload={() => {}}
              onDelete={() => {}}
            />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações ({lawyer.total_reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Maria Silva</h4>
                      <StarRating rating={5} totalReviews={1} />
                    </div>
                    <p className="text-gray-600 mt-2">Excelente atendimento e profissionalismo. Resolveu meu problema de forma rápida e eficaz.</p>
                    <p className="text-sm text-gray-500 mt-2">Há 2 semanas</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">João Santos</h4>
                      <StarRating rating={4} totalReviews={1} />
                    </div>
                    <p className="text-gray-600 mt-2">Muito bom! Explicou todo o processo de forma clara e objetiva. Recomendo!</p>
                    <p className="text-sm text-gray-500 mt-2">Há 1 mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre mim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>
                    Sou advogado há mais de 15 anos, especializado em direito civil e empresarial. 
                    Minha atuação se concentra na resolução de conflitos de forma célere e eficaz, 
                    sempre buscando os melhores resultados para meus clientes.
                  </p>
                  <p className="mt-4">
                    Formado pela Universidade Federal de Minas Gerais, pós-graduado em Direito Civil 
                    pela PUC-MG, sou membro da Ordem dos Advogados do Brasil e participo ativamente 
                    de diversos grupos de estudo e associações da categoria.
                  </p>
                  <p className="mt-4">
                    Meu escritório conta com uma equipe de profissionais altamente qualificados, 
                    preparados para atender as mais diversas demandas jurídicas com excelência e ética.
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