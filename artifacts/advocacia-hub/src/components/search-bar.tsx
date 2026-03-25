import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListSpecialties } from "@/hooks/use-specialties";

interface SearchBarProps {
  initialSpecialty?: string;
  initialLocation?: string;
  className?: string;
  onSearch?: (specialty: string, location: string) => void;
}

export function SearchBar({ initialSpecialty = "", initialLocation = "", className = "", onSearch }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [loc, setLoc] = useState(initialLocation);
  
  const { data: specialties = [] } = useListSpecialties();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(specialty, loc);
    } else {
      const params = new URLSearchParams();
      if (specialty) params.set("specialty", specialty);
      if (loc) {
        // Simple heuristic: if includes comma, split city/state
        if (loc.includes(",")) {
          const parts = loc.split(",");
          params.set("city", parts[0].trim());
          if (parts[1]) params.set("state", parts[1].trim());
        } else {
          params.set("search", loc); // generic search if no comma
        }
      }
      setLocation(`/buscar?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex flex-col md:flex-row bg-white rounded-2xl md:rounded-full p-2 shadow-clay-sm border border-white/50 ${className}`}>
      
      <div className="flex-1 flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-slate-100">
        <Scale className="w-5 h-5 text-primary/60 shrink-0 mr-3" />
        <select 
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-foreground text-sm font-medium appearance-none cursor-pointer placeholder:text-muted-foreground/70 focus:ring-0"
        >
          <option value="">Qual área do direito?</option>
          {specialties.map(spec => (
            <option key={spec.id} value={spec.slug}>{spec.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex items-center px-4 py-3 md:py-2">
        <MapPin className="w-5 h-5 text-primary/60 shrink-0 mr-3" />
        <input 
          type="text"
          placeholder="Cidade, Estado (ex: São Paulo, SP)"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-foreground text-sm font-medium placeholder:font-normal placeholder:text-muted-foreground/70 focus:ring-0"
        />
      </div>

      <Button type="submit" className="mt-2 md:mt-0 h-12 md:h-auto rounded-xl md:rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-clay-btn font-semibold text-sm transition-all duration-300">
        <Search className="w-4 h-4 mr-2" />
        Buscar Advogado
      </Button>
      
    </form>
  );
}
