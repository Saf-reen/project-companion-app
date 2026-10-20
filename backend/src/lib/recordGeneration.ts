import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { qrCodes, users } from "../db/schema.js";
import { FREE_GENERATION_LIMIT } from "../config.js";

export interface RecordGenerationInput {
  userId: string;
  kind: string;
  content: string;
  label: string | null;
}

export interface RecordGenerationResult {
  ok: boolean;
  count: number;
  plan: string;
}

export async function recordGeneration(
  input: RecordGenerationInput,
): Promise<RecordGenerationResult> {
  return db.transaction(async (tx) => {
    const [user] = await tx
      .select({ plan: users.plan, generationCount: users.generationCount })
      .from(users)
      .where(eq(users.id, input.userId))
      .for("update");

    if (!user) {
      throw new Error("User not found");
    }

    if (user.plan !== "pro" && user.generationCount >= FREE_GENERATION_LIMIT) {
      return { ok: false, count: user.generationCount, plan: user.plan };
    }

    await tx.insert(qrCodes).values({
      userId: input.userId,
      kind: input.kind,
      content: input.content,
      label: input.label,
    });

    const [updated] = await tx
      .update(users)
      .set({ generationCount: user.generationCount + 1 })
      .where(eq(users.id, input.userId))
      .returning({ generationCount: users.generationCount, plan: users.plan });

    return { ok: true, count: updated.generationCount, plan: updated.plan };
  });
}
