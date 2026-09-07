import flowsData from "@/data/flows.json";

export type FlowNode = {
  id: string;
  t: string;
  kind: "process" | "decision" | "terminal" | "start" | "note" | string;
  link: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type FlowEdge = { f: string; t: string; l: string };

export type Flow = {
  name: string;
  slug: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  w: number;
  h: number;
};

export const flows = flowsData as Flow[];

export const flowBySlug = (slug: string): Flow | undefined =>
  flows.find((f) => f.slug === slug);

export const inicio = flowBySlug("inicio");

/** Áreas temáticas de topo, tal como definidas na página "Inicio" do Visio. */
export const areas = (inicio?.nodes ?? [])
  .filter((n) => n.link && n.kind === "terminal")
  .map((n) => ({ titulo: n.t, slug: n.link as string }));

const semAcentos = (v: string) =>
  v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function pesquisarFlows(termo: string): Flow[] {
  const q = semAcentos(termo.trim());
  if (!q) return flows;
  return flows.filter(
    (f) =>
      semAcentos(f.name).includes(q) ||
      f.nodes.some((n) => semAcentos(n.t).includes(q)),
  );
}

export const totalPaginas = flows.length;
export const totalPassos = flows.reduce((acc, f) => acc + f.nodes.length, 0);
