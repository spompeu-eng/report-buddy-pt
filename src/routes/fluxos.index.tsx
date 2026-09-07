import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { flows, pesquisarFlows } from "@/lib/flows";

export const Route = createFileRoute("/fluxos/")({
  head: () => ({
    meta: [
      { title: "Todos os fluxogramas | Contact Center Gebalis" },
      {
        name: "description",
        content:
          "Índice pesquisável das páginas de fluxograma do Contact Center da Gebalis, com número de passos por processo.",
      },
      { property: "og:title", content: "Todos os fluxogramas | Contact Center Gebalis" },
      {
        property: "og:description",
        content: "Índice pesquisável das páginas de fluxograma do Contact Center da Gebalis.",
      },
    ],
  }),
  component: ListaFluxos,
});

function ListaFluxos() {
  const [termo, setTermo] = useState("");
  const resultados = useMemo(() => pesquisarFlows(termo), [termo]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Fluxogramas</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {flows.length} páginas disponíveis. A pesquisa abrange o título e o texto dos passos.
      </p>

      <label className="mt-6 block max-w-xl">
        <span className="text-sm font-medium">Pesquisar</span>
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Ex.: rendas, pragas, contrato…"
          className="mt-1 w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm"
        />
      </label>

      <p className="mt-4 text-sm text-muted-foreground" role="status">
        {resultados.length} resultado{resultados.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resultados.map((f) => (
          <li key={f.slug}>
            <Link
              to="/fluxos/$slug"
              params={{ slug: f.slug }}
              className="cartao block h-full p-4 transition-shadow hover:shadow-md"
            >
              <span className="block font-semibold">{f.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {f.nodes.length} passos · {f.edges.length} ligações
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
