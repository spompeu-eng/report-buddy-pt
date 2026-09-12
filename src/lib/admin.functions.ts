import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import type { FlowOverride } from "@/lib/overrides";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "gebalis-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function iguais(a: string, b: string) {
  const x = createHash("sha256").update(a, "utf8").digest();
  const y = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(x, y);
}

async function exigirAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("Sem permissões de administrador");
  return session;
}

export const entrarAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const esperada = process.env["ADMIN_PASSWORD"];
    if (!esperada) throw new Error("ADMIN_PASSWORD não configurada");
    if (!data.password || !iguais(data.password, esperada)) {
      return { ok: false as const };
    }
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const sairAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const estadoAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: session.data.admin === true };
});

export const guardarOverride = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string; override: FlowOverride }) => {
    if (!data || typeof data.slug !== "string" || !data.slug) {
      throw new Error("Fluxo inválido");
    }
    return data;
  })
  .handler(async ({ data }) => {
    await exigirAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("flow_overrides")
      .upsert({ slug: data.slug, data: data.override as never }, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const reporOverride = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    await exigirAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("flow_overrides")
      .delete()
      .eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
