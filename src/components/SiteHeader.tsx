import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="faixa-marca h-1 w-full" />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Página inicial Gebalis">
          <img src={logo.url} alt="Logótipo Gebalis" className="h-11 w-11" />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-base font-semibold">Gebalis</span>
            <span className="block text-xs text-muted-foreground">
              Fluxogramas · Contact Center
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm" aria-label="Navegação principal">
          <Link
            to="/"
            className="rounded-md px-3 py-2 hover:bg-muted"
            activeProps={{ className: "rounded-md px-3 py-2 bg-muted font-semibold" }}
            activeOptions={{ exact: true }}
          >
            Início
          </Link>
          <Link
            to="/fluxos"
            className="rounded-md px-3 py-2 hover:bg-muted"
            activeProps={{ className: "rounded-md px-3 py-2 bg-muted font-semibold" }}
          >
            Fluxogramas
          </Link>
          <Link
            to="/relatorio"
            className="rounded-md px-3 py-2 hover:bg-muted"
            activeProps={{ className: "rounded-md px-3 py-2 bg-muted font-semibold" }}
          >
            Relatório
          </Link>
        </nav>
      </div>
    </header>
  );
}
