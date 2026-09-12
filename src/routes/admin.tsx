import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { entrarAdmin, estadoAdmin, sairAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Modo Administrador | Fluxogramas Contact Center Gebalis" },
      {
        name: "description",
        content:
          "Acesso reservado para editar textos, setas e dimensões dos fluxogramas do Contact Center da Gebalis.",
      },
      { property: "og:title", content: "Modo Administrador | Fluxogramas Gebalis" },
      {
        property: "og:description",
        content: "Área reservada de edição dos fluxogramas do Contact Center da Gebalis.",
      },
    ],
  }),
  component: PaginaAdmin,
});

function PaginaAdmin() {
  const router = useRouter();
  const entrar = useServerFn(entrarAdmin);
  const sair = useServerFn(sairAdmin);
  const [erro, setErro] = useState(false);
  const [senha, setSenha] = useState("");

  const estado = useQuery({
    queryKey: ["admin-estado"],
    queryFn: () => estadoAdmin(),
  });

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    const r = await entrar({ data: { password: senha } });
    if (r.ok) {
      setErro(false);
      setSenha("");
      await estado.refetch();
      router.invalidate();
    } else {
      setErro(true);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Modo Administrador</h1>

      {estado.data?.admin ? (
        <div className="mt-6 space-y-4">
          <p className="cartao p-4 text-sm">
            Sessão de administrador ativa. Abra qualquer fluxograma e utilize o botão
            <strong> Editar </strong> para alterar textos, setas e dimensões.
          </p>
          <button
            type="button"
            onClick={async () => {
              await sair();
              await estado.refetch();
              router.invalidate();
            }}
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm hover:bg-muted"
          >
            Terminar sessão
          </button>
        </div>
      ) : (
        <form onSubmit={submeter} className="mt-6 space-y-3">
          <label htmlFor="senha" className="block text-sm font-medium">
            Senha de administrador
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
          {erro ? <p className="text-sm text-magenta">Senha incorreta.</p> : null}
          <button
            type="submit"
            className="rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-white"
          >
            Entrar
          </button>
        </form>
      )}
    </div>
  );
}
