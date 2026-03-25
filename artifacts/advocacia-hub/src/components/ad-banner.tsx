import { useListBanners } from "@workspace/api-client-react";
import { ExternalLink } from "lucide-react";

type BannerPosition = "header" | "sidebar" | "blog-between";

interface AdBannerProps {
  position: BannerPosition;
  className?: string;
  label?: string;
}

export function AdBanner({ position, className = "", label = "Publicidade" }: AdBannerProps) {
  const { data: banners } = useListBanners({ position });

  if (!banners || banners.length === 0) {
    return (
      <div className={`rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2 ${
        position === "sidebar" ? "min-h-[200px] p-4" : "min-h-[100px] p-6"
      } ${className}`}>
        <ExternalLink className="w-5 h-5 opacity-40" />
        <span className="opacity-60">Espaço para Anúncio</span>
        <span className="opacity-40 text-center">{position === "sidebar" ? "300×250" : "728×90"}</span>
      </div>
    );
  }

  const banner = banners[0]!;

  return (
    <div className={`relative group ${className}`}>
      <span className="absolute top-1.5 left-2 text-[10px] text-muted-foreground/60 z-10 bg-background/80 px-1.5 py-0.5 rounded-sm">
        {label}
      </span>
      <a
        href={banner.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className={`w-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ${
            position === "sidebar" ? "h-[220px]" : "h-[100px] md:h-[120px]"
          }`}
        />
      </a>
    </div>
  );
}

export function SidebarAdStack({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Publicidade</p>
      <AdBanner position="sidebar" />
      <AdBanner position="sidebar" label="Patrocinado" />
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 text-center">
        <p className="text-sm font-semibold text-primary mb-1">É advogado?</p>
        <p className="text-xs text-muted-foreground mb-3">Anuncie aqui e receba leads qualificados</p>
        <a
          href="/cadastro?role=lawyer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Saiba mais <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
