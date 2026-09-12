import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { estadoAdmin } from "@/lib/admin.functions";
import type { FlowOverride } from "@/lib/overrides";

export function useFlowOverride(slug: string) {
  return useQuery({
    queryKey: ["flow-override", slug],
    queryFn: async (): Promise<FlowOverride> => {
      const { data, error } = await supabase
        .from("flow_overrides")
        .select("data")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return ((data?.data as FlowOverride | null) ?? {}) as FlowOverride;
    },
  });
}

export function useEstadoAdmin() {
  return useQuery({
    queryKey: ["admin-estado"],
    queryFn: () => estadoAdmin(),
    staleTime: 60_000,
  });
}
