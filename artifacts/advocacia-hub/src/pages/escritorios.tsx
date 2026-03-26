import { Layout } from "@/components/layout";
import { useListLawyers } from "@/hooks/use-lawyers";
import { Building2, MapPin, Users, Star, Scale, Search } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/star-rating";

export default function EscritoriosPage() {
  const { data: lawyersData, isLoading: loadingLawyers } = useListLawyers({ 
    limit: 12
  });

  // Group lawyers by office to create office cards
  const officesMap = new Map();
  
  if (!loadingLawyers && lawyersData?.data) {
    lawyersData.data.forEach(lawyer => {
      if (lawyer.office) {
        const office = lawyer.office;
        if (!officesMap.has(office.id)) {
          officesMap.set(office.id, {
            ...office,
            lawyers: [],
            totalReviews: 0,
            avgRating: 0
          });
        }
        
        const officeData = officesMap.get(office.id);
        officeData.lawyers.push(lawyer);
        officeData.totalReviews += lawyer.totalReviews;
        
        // Calculate average rating considering all lawyers in the office
        const totalRating = officeData.avgRating * (officeData.lawyers.length - 1) + (lawyer.avgRating || 0);
        officeData.avgRating = totalRating / officeData.lawyers.length;
      }
    });
  }

  const offices = Array.from(officesMap.values());

  return (
    <Layout>
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              <span>Escritórios de Advocacia</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
              Conheça os melhores <span className="text-primary">escritórios de advocacia</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Descubra escritórios de advocacia com excelentes avaliações, especialidades variadas e profissionais qualificados para atender às suas necessidades jurídicas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offices Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Escritórios em Destaque</h2>
              <p className="text-slate-500">
                {offices.length > 0 
                  ? `${offices.length} escritório${offices.length > 1 ? 's' : ''} encontrados` 
                  : 'Carregando escritórios...'}
              </p>
            </div>
          </div>

          {loadingLawyers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-64 rounded-3xl" />
              ))}
            </div>
          ) : offices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offices.map(office => (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * Math.random() }}
                  className="group bg-white rounded-3xl p-6 shadow-clay-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-clay border border-white/40"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        {office.logoUrl ? (
                          <img
                            src={office.logoUrl}
                            alt={office.tradeName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {office.tradeName}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                          <span className="truncate">{office.city}, {office.state}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{office.lawyerCount} advogado{office.lawyerCount !== 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium">
                          {office.avgRating ? office.avgRating.toFixed(1) : 'N/A'} 
                          <span className="text-slate-400 ml-1">({office.totalReviews})</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 mb-6">
                      <div className="flex flex-wrap gap-1.5">
                        {office.lawyers.slice(0, 3).map(lawyer => (
                          <span 
                            key={lawyer.id}
                            className="inline-flex text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
                          >
                            {lawyer.specialties.slice(0, 1).map(spec => spec.name)}
                          </span>
                        ))}
                        {office.lawyers.length > 3 && (
                          <span className="inline-flex text-xs font-medium px-2 py-1 rounded-md bg-slate-50 text-slate-500">
                            +{office.lawyers.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <Link href={`/buscar?city=${office.city}&state=${office.state}`}>
                        <button className="w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Scale className="w-4 h-4" />
                          Ver advogados em {office.city}
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Building2 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum escritório encontrado</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                Não encontramos escritórios de advocacia com os critérios selecionados.
              </p>
              <Link href="/buscar">
                <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Procurar Advogados
                </button>
              </Link>
            </div>
          )}

          {/* Stats Section */}
          {offices.length > 0 && (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-6 border border-primary/10">
                <div className="text-3xl font-bold text-primary mb-2">{offices.length}</div>
                <div className="text-slate-600 font-medium">Escritórios</div>
                <div className="text-sm text-slate-500 mt-1">registrados na plataforma</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-100">
                <div className="text-3xl font-bold text-emerald-700 mb-2">
                  {offices.reduce((sum, office) => sum + office.lawyerCount, 0)}
                </div>
                <div className="text-slate-600 font-medium">Advogados</div>
                <div className="text-sm text-slate-500 mt-1">disponíveis para consultas</div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border border-amber-100">
                <div className="text-3xl font-bold text-amber-700 mb-2">
                  {offices.length > 0 
                    ? (offices.reduce((sum, office) => sum + office.avgRating, 0) / offices.length).toFixed(1) 
                    : '0.0'}
                </div>
                <div className="text-slate-600 font-medium">Avaliação média</div>
                <div className="text-sm text-slate-500 mt-1">dos escritórios</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}