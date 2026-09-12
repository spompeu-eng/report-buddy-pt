import type { Flow } from "@/lib/flows";

export type NodeOverride = {
  t?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export type EdgeOverride = { l?: string };

export type FlowOverride = {
  nodes?: Record<string, NodeOverride>;
  edges?: Record<string, EdgeOverride>;
  arrow?: { color?: string; width?: number };
  zoom?: number;
};

export const overrideVazio: FlowOverride = {};

/** Aplica as alterações do Administrador sobre o fluxo original. */
export function aplicarOverride(flow: Flow, ov: FlowOverride | null | undefined): Flow {
  if (!ov || (!ov.nodes && !ov.edges)) return flow;
  const nodes = flow.nodes.map((n) => {
    const o = ov.nodes?.[n.id];
    return o ? { ...n, ...o } : n;
  });
  const edges = flow.edges.map((e, i) => {
    const o = ov.edges?.[String(i)];
    return o && typeof o.l === "string" ? { ...e, l: o.l } : e;
  });
  const w = Math.max(flow.w, ...nodes.map((n) => n.x + n.w + 40));
  const h = Math.max(flow.h, ...nodes.map((n) => n.y + n.h + 40));
  return { ...flow, nodes, edges, w, h };
}
