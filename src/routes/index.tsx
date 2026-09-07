import { createFileRoute, Link } from "@tanstack/react-router";
import { areas, inicio, totalPaginas, totalPassos } from "@/lib/flows";
import { FlowCanvas } from "@/components/FlowCanvas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fluxogramas Contact Center | Gebalis" },
      {
        name: "description",
        content:
          "Navegue pelos fluxos de atendimento do Contact Center da Gebalis por área temática: Social, Edificado, Rendas, ENH, DAJ e outras.",
      },
      { property: "og:title", content: "Fluxogramas Contact Center | Gebalis" },
      {
        property: "og:description",
        content:
          "Consulta interativa dos fluxos de atendimento e encaminhamento do Contact Center da Gebalis.",
      },
    ],
  }),
  component: Inicio,
});

const etapas = [
  { n: "1", t: "Acesso", d: "Abertura da aplicação no endereço publicado." },
  { n: "2", t: "Orientação", d: "Escolha da área temática e do fluxo aplicável." },
  { n: "3", t: "Consulta", d: "Leitura do fluxograma e das ligações internas." },
  { n: "4", t: "Resultado", d: "Orientação para encaminhamento do processo." },
];

function Inicio() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="cartao overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
              Gebalis · Contact Center
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Fluxogramas de atendimento e encaminhamento
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Aplicação de consulta dos processos do Contact Center, construída a partir
              da exportação Visio “Fluxograma_Vision_T1” e organizada segundo a estrutura
              do Relatório de Caracterização e Pré-Auditoria Externa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/fluxos"
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Ver todos os fluxogramas
              </Link>
              <Link
                to="/relatorio"
                className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
              >
                Relatório de pré-auditoria
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-start">
            <div className="rounded-xl border border-border bg-muted p-5">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Páginas de fluxo
              </dt>
              <dd className="mt-1 text-3xl font-bold text-turquesa">{totalPaginas}</dd>
            </div>
            <div className="rounded-xl border border-border bg-muted p-5">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Passos mapeados
              </dt>
              <dd className="mt-1 text-3xl font-bold text-verde">{totalPassos}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="areas">
        <h2 id="areas" className="text-2xl font-semibold">
          Áreas temáticas
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Encaminhamento do motivo do contacto por área responsável.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                to="/fluxos/$slug"
                params={{ slug: a.slug }}
                className="cartao block h-full p-5 transition-shadow hover:shadow-md"
              >
                <span className="block text-lg font-semibold">{a.titulo}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Consultar fluxos da área
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="utilizacao">
        <h2 id="utilizacao" className="text-2xl font-semibold">
          Fluxo de utilização
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map((e) => (
            <li key={e.n} className="cartao p-5">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                {e.n}
              </span>
              <h3 className="mt-3 font-semibold">{e.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {inicio ? (
        <section className="mt-12" aria-labelledby="fluxo-geral">
          <h2 id="fluxo-geral" className="text-2xl font-semibold">
            Fluxo geral do atendimento
          </h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Os passos sublinhados abrem o fluxo detalhado correspondente.
          </p>
          <FlowCanvas flow={inicio} />
        </section>
      ) : null}
    </div>
  );
}
