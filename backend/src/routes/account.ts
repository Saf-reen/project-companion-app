import { Router } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client.js";
import { qrCodes, users } from "../db/schema.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { recordGeneration } from "../lib/recordGeneration.js";

export const accountRouter = Router();

accountRouter.get("/account", requireAuth, async (req: AuthedRequest, res) => {
  const [user] = await db
    .select({
      email: users.email,
      plan: users.plan,
      count: users.generationCount,
      memberSince: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, req.userId!));

  if (!user) {
    res.status(404).json({ error: "Account not found" });
    return;
  }

  res.json(user);
});

const generateSchema = z.object({
  kind: z.string().min(1).max(20),
  content: z.string().min(1).max(4000),
  label: z.string().max(200).optional().nullable(),
});

accountRouter.post("/generate", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const result = await recordGeneration({
    userId: req.userId!,
    kind: parsed.data.kind,
    content: parsed.data.content,
    label: parsed.data.label ?? null,
  });

  res.json(result);
});

accountRouter.get("/codes", requireAuth, async (req: AuthedRequest, res) => {
  const codes = await db
    .select({
      id: qrCodes.id,
      kind: qrCodes.kind,
      content: qrCodes.content,
      label: qrCodes.label,
      createdAt: qrCodes.createdAt,
    })
    .from(qrCodes)
    .where(eq(qrCodes.userId, req.userId!))
    .orderBy(desc(qrCodes.createdAt))
    .limit(100);

  res.json(codes);
});

const idParamSchema = z.object({ id: z.string().uuid() });

accountRouter.delete("/codes/:id", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = idParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db
    .delete(qrCodes)
    .where(and(eq(qrCodes.id, parsed.data.id), eq(qrCodes.userId, req.userId!)));

  res.json({ ok: true });
});
