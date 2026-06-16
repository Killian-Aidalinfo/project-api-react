import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Repository } from "./repositories/types.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactValidation {
  ok: boolean;
  error?: string;
  value?: { nom: string; email: string; message: string };
}

function validateContact(body: unknown): ContactValidation {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Corps de requête invalide." };
  }
  const { nom, email, message } = body as Record<string, unknown>;

  if (typeof nom !== "string" || nom.trim() === "") {
    return { ok: false, error: "Le nom est requis." };
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { ok: false, error: "Un email valide est requis." };
  }
  if (typeof message !== "string" || message.trim() === "") {
    return { ok: false, error: "Le message est requis." };
  }

  return {
    ok: true,
    value: { nom: nom.trim(), email: email.trim(), message: message.trim() },
  };
}

/**
 * Construit l'application Hono à partir d'un Repository injecté.
 * La même logique sert en prod (MysqlRepository) et en test (InMemoryRepository).
 */
export function createApp(repo: Repository): Hono {
  const app = new Hono();

  app.use("/api/*", cors());

  app.get("/api/health", (c) => c.json({ status: "ok" }));

  app.get("/api/team", async (c) => c.json(await repo.getTeam()));
  app.get("/api/services", async (c) => c.json(await repo.getServices()));
  app.get("/api/projects", async (c) => c.json(await repo.getProjects()));
  app.get("/api/faq", async (c) => c.json(await repo.getFaq()));

  app.get("/api/contact", async (c) => c.json(await repo.listContacts()));

  app.post("/api/contact", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "JSON invalide." }, 400);
    }

    const result = validateContact(body);
    if (!result.ok || !result.value) {
      return c.json({ error: result.error }, 400);
    }

    const id = await repo.createContact(result.value);
    return c.json({ success: true, id }, 201);
  });

  return app;
}
