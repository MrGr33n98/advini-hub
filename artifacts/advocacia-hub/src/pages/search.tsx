import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { LawyerCard } from "@/components/lawyer-card";
import { SearchBar } from "@/components/search-bar";
import { useLawyerSearch } from "@/hooks/use-lawyers";
import { useListSpecialties } from "@/hooks/use-specialties";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Star, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SearchPage() {
  // Parse URL params for initial state
  const searchParams = new URLSearchParams(window.location.search);
  const initialSpecialty = searchParams.get("specialty") || "";
  const initialCity = searchParams.get("city") || "";
  const initialSearch = searchParams.get("search") || "";

  const [localSearchLoc, setLocalSearchLoc] = useState(initialCity || initialSearch);
  const [localSearchSpec, setLocalSearchSpec] = useState(initialSpecialty);

  const { data: specialties } = useListSpecialties();
  
  const { 
    data, 
    isLoading, 
    params, 
    updateFilters, 
    setPage 
  } = useLawyerSearch({
    specialty: initialSpecialty,
    city: initialCity,
    search: initialSearch,
    limit: 12
  });

  // Handle SearchBar submit on this page
  const handleTopSearch = (spec: string, loc: string) => {
    setLocalSearchSpec(spec);
    setLocalSearchLoc(loc);
    
    // Convert loc string to generic search or city
    let city = undefined;
    let search = undefined;
    
    if (loc) {
      if (loc.includes(",")) {
        city = loc.split(",")[0].trim();
      } else {
        search = loc;
      }
    }
    
    updateFilters({ 
      specialty: spec || undefined, 
      city, 
      search,
      state: undefined // clear state if new generic loc
    });
  };

  const handleRatingFilter = (rating: number) => {
    updateFilters({ minRating: rating === params.minRating ? undefined : rating });
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Especialidade</h3>
        <div className="space-y-3">
          {specialties?.map(spec => (
            <label key={spec.id} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox 
                checked={params.specialty === spec.slug}
                onCheckedChange={(checked) => {
                  updateFilters({ specialty: checked ? spec.slug : undefined });
                }}
                className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">{spec.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Avaliação Mínima</h3>
        <div className="space-y-3">
          {[4, 3, 2].map(rating => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox 
                checked={params.minRating === rating}
                onCheckedChange={() => handleRatingFilter(rating)}
                className="border-slate-300 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
              />
              <div className="flex items-center text-sm text-slate-700 group-hover:text-secondary transition-colors">
                <Star className="w-4 h-4 fill-secondary text-secondary mr-1" />
                <span>{rating}.0 ou mais</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Search Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SearchBar 
            initialSpecialty={localSearchSpec}
            initialLocation={localSearchLoc}
            onSearch={handleTopSearch}
            className="max-w-4xl shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Filtros</h2>
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                {isLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  `${data?.total || 0} advogados encontrados`
                )}
              </h1>

              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden shadow-sm bg-white">
                    <Filter className="w-4 h-4 mr-2" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-3xl" />)}
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map(lawyer => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button 
                      variant="outline" 
                      onClick={() => setPage((params.page || 1) - 1)}
                      disabled={(params.page || 1) === 1}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-slate-600 px-4">
                      Página {data.page} de {data.totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => setPage((params.page || 1) + 1)}
                      disabled={(params.page || 1) === data.totalPages}
                      className="rounded-xl"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum advogado encontrado</h3>
                <p className="text-slate-500 max-w-md mx-auto">Tente ajustar seus filtros de busca ou procurar por outra cidade/especialidade.</p>
                <Button 
                  variant="outline" 
                  className="mt-6 rounded-xl"
                  onClick={() => updateFilters({ specialty: undefined, city: undefined, search: undefined, minRating: undefined })}
                >
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
