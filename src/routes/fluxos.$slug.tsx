import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { FlowCanvas } from "@/components/FlowCanvas";
import { FlowEditorPanel } from "@/components/FlowEditorPanel";
import { flowBySlug, flows } from "@/lib/flows";
import { aplicarOverride, type FlowOverride } from "@/lib/overrides";
import { useEstadoAdmin, useFlowOverride } from "@/lib/useFlowOverride";
import { guardarOverride, reporOverride } from "@/lib/admin.functions";

export const Route = createFileRoute("/fluxos/$slug")({
  loader: ({ params }) => {
    const flow = flowBySlug(params.slug);
    if (!flow) throw notFound();
    return flow;
  },
  head: ({ loaderData }) => {
    const nome = loaderData?.name ?? "Fluxograma";
    const desc = `Fluxograma "${nome}" do Contact Center da Gebalis: passos, decisões e encaminhamentos.`;
    return {
      meta: [
        { title: `${nome} | Fluxogramas Contact Center Gebalis` },
        { name: "description", content: desc },
        { property: "og:title", content: `${nome} | Fluxogramas Contact Center Gebalis` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: PaginaFluxo,
});

function PaginaFluxo() {
  const flowBase = Route.useLoaderData();
  const guardadoQuery = useFlowOverride(flowBase.slug);
  const adminQuery = useEstadoAdmin();
  const guardar = useServerFn(guardarOverride);
  const repor = useServerFn(reporOverride);

  const [edicao, setEdicao] = useState(false);
  const [rascunho, setRascunho] = useState<FlowOverride>({});
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [aGuardar, setAGuardar] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const guardado = guardadoQuery.data ?? {};
  useEffect(() => {
    if (!edicao) setRascunho(guardado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardadoQuery.dataUpdatedAt, edicao]);

  const override = edicao ? rascunho : guardado;
  const flow = aplicarOverride(flowBase, override);
  const admin = adminQuery.data?.admin === true;

  async function aoGuardar() {
    setAGuardar(true);
    setMensagem(null);
    try {
      await guardar({ data: { slug: flowBase.slug, override: rascunho } });
      await guardadoQuery.refetch();
      setMensagem("Alterações guardadas e visíveis para todos.");
    } catch {
      setMensagem("Não foi possível guardar. Verifique a sessão de administrador.");
    } finally {
      setAGuardar(false);
    }
  }

  async function aoRepor() {
    setAGuardar(true);
    try {
      await repor({ data: { slug: flowBase.slug } });
      setRascunho({});
      await guardadoQuery.refetch();
      setMensagem("Fluxograma reposto na versão original.");
    } catch {
      setMensagem("Não foi possível repor.");
    } finally {
      setAGuardar(false);
    }
  }

  const idx = flows.findIndex((f) => f.slug === flow.slug);
  const anterior = idx > 0 ? flows[idx - 1] : undefined;
  const seguinte = idx < flows.length - 1 ? flows[idx + 1] : undefined;
  const ligacoes = flow.nodes.filter((n) => n.link);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Trilho" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">
          Início
        </Link>{" "}
        /{" "}
        <Link to="/fluxos" className="hover:underline">
          Fluxogramas
        </Link>{" "}
        / <span className="text-foreground">{flow.name}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold">{flow.name}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        {flow.nodes.length} passos · {flow.edges.length} ligações
      </p>

      {admin ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-magenta px-3 py-1 text-xs font-semibold text-white">
            Modo Administrador
          </span>
          <button
            type="button"
            onClick={() => {
              setEdicao((v) => !v);
              setSelecionado(null);
              setMensagem(null);
            }}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm hover:bg-muted"
          >
            {edicao ? "Sair da edição" : "Editar este fluxograma"}
          </button>
        </div>
      ) : null}

      <FlowCanvas
        flow={flow}
        zoomInicial={override.zoom ?? 1}
        corSeta={override.arrow?.color ?? "var(--color-turquesa)"}
        espessuraSeta={override.arrow?.width ?? 1.6}
        {...(edicao
          ? { selecionado, onSelecionar: (id: string) => setSelecionado(id) }
          : {})}
      />

      {admin && edicao ? (
        <FlowEditorPanel
          flow={flow}
          override={rascunho}
          selecionado={selecionado}
          onAlterar={setRascunho}
          onGuardar={aoGuardar}
          onRepor={aoRepor}
          aGuardar={aGuardar}
          mensagem={mensagem}
        />
      ) : null}

      {ligacoes.length > 0 ? (
        <section className="mt-8" aria-labelledby="ligacoes">
          <h2 id="ligacoes" className="text-xl font-semibold">
            Encaminhamentos a partir deste fluxo
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ligacoes.map((n) => (
              <li key={n.id}>
                <Link
                  to="/fluxos/$slug"
                  params={{ slug: n.link as string }}
                  className="inline-block rounded-full border border-turquesa bg-surface px-4 py-2 text-sm hover:bg-muted"
                >
                  {n.t}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8" aria-labelledby="versao-texto">
        <h2 id="versao-texto" className="text-xl font-semibold">
          Versão textual dos passos
        </h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {flow.nodes.map((n) => (
            <li key={n.id} className="cartao p-3 text-sm">
              <span className="mr-2 rounded bg-muted px-2 py-0.5 text-xs uppercase text-muted-foreground">
                {n.kind === "decision"
                  ? "decisão"
                  : n.kind === "terminal"
                    ? "encaminhamento"
                    : n.kind === "start"
                      ? "início"
                      : "passo"}
              </span>
              {n.t}
            </li>
          ))}
        </ol>
      </section>

      <nav className="mt-10 flex justify-between gap-4 text-sm" aria-label="Páginas vizinhas">
        {anterior ? (
          <Link
            to="/fluxos/$slug"
            params={{ slug: anterior.slug }}
            className="cartao px-4 py-3 hover:bg-muted"
          >
            ← {anterior.name}
          </Link>
        ) : (
          <span />
        )}
        {seguinte ? (
          <Link
            to="/fluxos/$slug"
            params={{ slug: seguinte.slug }}
            className="cartao px-4 py-3 text-right hover:bg-muted"
          >
            {seguinte.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
