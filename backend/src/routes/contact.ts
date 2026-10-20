import { Router } from "express";
import { z } from "zod";
import { db } from "../db/client.js";
import { contactMessages } from "../db/schema.js";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(2000),
});

contactRouter.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.flatten() });
    return;
  }

  try {
    await db.insert(contactMessages).values(parsed.data);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});
