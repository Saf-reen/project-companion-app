import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { FREE_GENERATION_LIMIT } from "@/config/config";

/** Signed-in user's plan and server-side generation count. */
export const getAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("email, plan, generation_count, created_at")
      .eq("id", context.userId)
      .maybeSingle();
    return {
      email: data?.email ?? (context.claims as { email?: string }).email ?? "",
      plan: data?.plan === "pro" ? ("pro" as const) : ("free" as const),
      count: data?.generation_count ?? 0,
      memberSince: data?.created_at ?? new Date().toISOString(),
    };
  });

/** Atomically checks the free limit, increments the counter and saves the code. */
export const recordGenerationServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ kind: z.string().max(20), content: z.string().min(1).max(4000), label: z.string().max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: res, error } = await context.supabase.rpc("record_generation", {
      _kind: data.kind,
      _content: data.content,
      _label: data.label,
      _limit: FREE_GENERATION_LIMIT,
    });
    if (error) {
      console.error("record_generation failed", error);
      throw new Error("Could not save your QR code. Please try again.");
    }
    return res as { ok: boolean; count: number; plan: string };
  });

export const listMyCodes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("qr_codes")
      .select("id, kind, content, label, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error("Could not load your codes.");
    return data;
  });

export const deleteMyCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("qr_codes").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete.");
    return { ok: true };
  });
