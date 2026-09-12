import type { Flow } from "@/lib/flows";
import type { FlowOverride } from "@/lib/overrides";

type Props = {
  flow: Flow;
  override: FlowOverride;
  selecionado: string | null;
  onAlterar: (ov: FlowOverride) => void;
  onGuardar: () => void;
  onRepor: () => void;
  aGuardar: boolean;
  mensagem: string | null;
};

const campoCls =
  "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm";

export function FlowEditorPanel({
  flow,
  override,
  selecionado,
  onAlterar,
  onGuardar,
  onRepor,
  aGuardar,
  mensagem,
}: Props) {
  const node = flow.nodes.find((n) => n.id === selecionado) ?? null;

  const alterarNode = (patch: Record<string, string | number>) => {
    if (!node) return;
    onAlterar({
      ...override,
      nodes: {
        ...(override.nodes ?? {}),
        [node.id]: { ...(override.nodes?.[node.id] ?? {}), ...patch },
      },
    });
  };

  return (
    <aside className="cartao mt-4 space-y-5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">Edição de administrador</h2>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onRepor}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm hover:bg-muted"
          >
            Repor original
          </button>
          <button
            type="button"
            onClick={onGuardar}
            disabled={aGuardar}
            className="rounded-md bg-magenta px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {aGuardar ? "A guardar…" : "Guardar alterações"}
          </button>
        </div>
      </div>
      {mensagem ? <p className="text-sm text-turquesa">{mensagem}</p> : null}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Caixa selecionada</h3>
        {node ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2 block text-xs">
              Texto
              <textarea
                className={`${campoCls} mt-1`}
                rows={2}
                value={node.t}
                onChange={(e) => alterarNode({ t: e.target.value })}
              />
            </label>
            {(["x", "y", "w", "h"] as const).map((k) => (
              <label key={k} className="block text-xs">
                {k === "w"
                  ? "Largura"
                  : k === "h"
                    ? "Altura"
                    : k === "x"
                      ? "Posição horizontal"
                      : "Posição vertical"}
                <input
                  type="number"
                  className={`${campoCls} mt-1`}
                  value={node[k]}
                  onChange={(e) => alterarNode({ [k]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Clique numa caixa do fluxograma para a editar.
          </p>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Setas</h3>
        <div className="flex flex-wrap items-end gap-4">
          <label className="block text-xs">
            Cor
            <input
              type="color"
              className="mt-1 block h-9 w-16 rounded-md border border-border"
              value={override.arrow?.color ?? "#379C8D"}
              onChange={(e) =>
                onAlterar({
                  ...override,
                  arrow: { ...(override.arrow ?? {}), color: e.target.value },
                })
              }
            />
          </label>
          <label className="block text-xs">
            Espessura
            <input
              type="number"
              step="0.2"
              min="0.5"
              max="6"
              className={`${campoCls} mt-1 w-28`}
              value={override.arrow?.width ?? 1.6}
              onChange={(e) =>
                onAlterar({
                  ...override,
                  arrow: { ...(override.arrow ?? {}), width: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className="block text-xs">
            Zoom por defeito (%)
            <input
              type="number"
              step="10"
              min="40"
              max="200"
              className={`${campoCls} mt-1 w-32`}
              value={Math.round((override.zoom ?? 1) * 100)}
              onChange={(e) =>
                onAlterar({ ...override, zoom: Number(e.target.value) / 100 })
              }
            />
          </label>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Textos das setas</h3>
        <div className="grid max-h-64 gap-2 overflow-auto sm:grid-cols-2">
          {flow.edges.map((e, i) => (
            <label key={i} className="block text-xs">
              {`Seta ${i + 1}`}
              <input
                className={`${campoCls} mt-1`}
                value={e.l}
                onChange={(ev) =>
                  onAlterar({
                    ...override,
                    edges: {
                      ...(override.edges ?? {}),
                      [String(i)]: { l: ev.target.value },
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
