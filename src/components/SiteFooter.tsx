export function SiteFooter() {
  const data = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="faixa-marca h-1 w-full" />
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Fluxogramas - Contact Center</p>
        <p>{data}</p>
      </div>
    </footer>
  );
}
