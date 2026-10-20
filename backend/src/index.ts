import "dotenv/config";
import cors from "cors";
import express from "express";
import { accountRouter } from "./routes/account.js";
import { authRouter } from "./routes/auth.js";
import { contactRouter } from "./routes/contact.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", accountRouter);
app.use("/api", contactRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
