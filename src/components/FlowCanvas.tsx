import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { Flow, FlowNode } from "@/lib/flows";

const estilos: Record<string, string> = {
  decision:
    "bg-[color-mix(in_oklab,var(--color-verde)_16%,white)] border-verde text-foreground",
  terminal:
    "bg-[color-mix(in_oklab,var(--color-turquesa)_14%,white)] border-turquesa text-foreground",
  start:
    "bg-[color-mix(in_oklab,var(--color-magenta)_12%,white)] border-magenta text-foreground",
  note: "bg-muted border-border text-muted-foreground",
  process: "bg-surface border-border text-foreground",
};

function caminho(a: FlowNode, b: FlowNode) {
  const ax = a.x + a.w / 2;
  const bx = b.x + b.w / 2;
  const ay = a.y + a.h;
  const by = b.y;
  if (Math.abs(ax - bx) < 6) return `M ${ax} ${ay} L ${bx} ${by}`;
  const meio = ay + (by - ay) / 2;
  if (by > ay) return `M ${ax} ${ay} V ${meio} H ${bx} V ${by}`;
  // ligação lateral / de retorno
  const aySide = a.y + a.h / 2;
  const bySide = b.y + b.h / 2;
  const saida = ax < bx ? a.x + a.w : a.x;
  const entrada = ax < bx ? b.x : b.x + b.w;
  const mx = saida + (entrada - saida) / 2;
  return `M ${saida} ${aySide} H ${mx} V ${bySide} H ${entrada}`;
}

export function FlowCanvas({ flow }: { flow: Flow }) {
  const [zoom, setZoom] = useState(1);
  const mapa = useMemo(
    () => new Map(flow.nodes.map((n) => [n.id, n])),
    [flow],
  );

  if (flow.nodes.length === 0) {
    return (
      <p className="cartao p-6 text-sm text-muted-foreground">
        Esta página do documento de origem não contém passos legíveis.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Zoom</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))}
          className="rounded-md border border-border bg-surface px-3 py-1 text-sm hover:bg-muted"
          aria-label="Reduzir"
        >
          −
        </button>
        <span className="w-14 text-center text-sm tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
          className="rounded-md border border-border bg-surface px-3 py-1 text-sm hover:bg-muted"
          aria-label="Aumentar"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          className="rounded-md border border-border bg-surface px-3 py-1 text-sm hover:bg-muted"
        >
          Repor
        </button>
      </div>

      <div className="cartao overflow-auto p-4">
        <div
          style={{
            width: flow.w * zoom,
            height: flow.h * zoom,
            position: "relative",
          }}
        >
          <div
            style={{
              width: flow.w,
              height: flow.h,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              position: "absolute",
            }}
          >
            <svg
              width={flow.w}
              height={flow.h}
              className="absolute inset-0"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="seta"
                  markerWidth="9"
                  markerHeight="9"
                  refX="7"
                  refY="4.5"
                  orient="auto"
                >
                  <path d="M0,0 L9,4.5 L0,9 z" fill="var(--color-turquesa)" />
                </marker>
              </defs>
              {flow.edges.map((e, i) => {
                const a = mapa.get(e.f);
                const b = mapa.get(e.t);
                if (!a || !b) return null;
                return (
                  <g key={i}>
                    <path
                      d={caminho(a, b)}
                      fill="none"
                      stroke="var(--color-turquesa)"
                      strokeWidth={1.6}
                      markerEnd="url(#seta)"
                    />
                    {e.l ? (
                      <text
                        x={(a.x + a.w / 2 + b.x + b.w / 2) / 2}
                        y={(a.y + a.h + b.y) / 2 - 4}
                        textAnchor="middle"
                        fontSize={11}
                        fill="var(--color-grafite)"
                      >
                        {e.l}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {flow.nodes.map((n) => {
              const classes = `absolute flex items-center justify-center overflow-hidden border px-2 text-center text-[11px] leading-tight shadow-sm ${
                estilos[n.kind] ?? estilos["process"]
              } ${n.kind === "terminal" || n.kind === "start" ? "rounded-full" : "rounded-md"}`;
              const style = {
                left: n.x,
                top: n.y,
                width: n.w,
                height: n.h,
              } as const;
              if (n.link) {
                return (
                  <Link
                    key={n.id}
                    to="/fluxos/$slug"
                    params={{ slug: n.link }}
                    style={style}
                    className={`${classes} font-semibold underline decoration-magenta decoration-2 underline-offset-2 transition-transform hover:scale-[1.03]`}
                  >
                    {n.t}
                  </Link>
                );
              }
              return (
                <div key={n.id} style={style} className={classes}>
                  {n.t}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
