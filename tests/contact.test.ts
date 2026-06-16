import { beforeEach, describe, expect, it } from "bun:test";
import { createApp } from "../src/app.ts";
import { InMemoryRepository } from "../src/repositories/memory.ts";

// res.json() est typé `unknown` sous Bun ; helper pour alléger les tests.
const json = (res: Response): Promise<any> => res.json();

let repo: InMemoryRepository;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  repo = new InMemoryRepository();
  app = createApp(repo);
});

function post(body: unknown, raw = false) {
  return app.request("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("crée un message valide et renvoie 201 avec un id", async () => {
    const res = await post({
      nom: "Jean Test",
      email: "jean@example.com",
      message: "Bonjour, je teste l'API.",
    });
    expect(res.status).toBe(201);
    const data = await json(res);
    expect(data.success).toBe(true);
    expect(typeof data.id).toBe("number");

    const stored = await repo.listContacts();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      nom: "Jean Test",
      email: "jean@example.com",
      message: "Bonjour, je teste l'API.",
    });
  });

  it("trim les champs avant de stocker", async () => {
    await post({
      nom: "  Marie  ",
      email: "  marie@example.com  ",
      message: "  coucou  ",
    });
    const stored = await repo.listContacts();
    expect(stored[0]).toMatchObject({
      nom: "Marie",
      email: "marie@example.com",
      message: "coucou",
    });
  });

  it("refuse un nom vide avec 400", async () => {
    const res = await post({ nom: "  ", email: "a@b.fr", message: "salut" });
    expect(res.status).toBe(400);
    expect((await json(res)).error).toBeTruthy();
  });

  it("refuse un email mal formé avec 400", async () => {
    const res = await post({ nom: "Léa", email: "pas-un-email", message: "salut" });
    expect(res.status).toBe(400);
  });

  it("refuse un message vide avec 400", async () => {
    const res = await post({ nom: "Léa", email: "lea@x.fr", message: "" });
    expect(res.status).toBe(400);
  });

  it("refuse un body JSON invalide avec 400", async () => {
    const res = await post("{ pas du json", true);
    expect(res.status).toBe(400);
  });

  it("ne crée rien quand la validation échoue", async () => {
    await post({ nom: "", email: "", message: "" });
    expect(await repo.listContacts()).toHaveLength(0);
  });
});

describe("GET /api/contact", () => {
  it("liste les messages reçus", async () => {
    await post({ nom: "A", email: "a@a.fr", message: "un" });
    await post({ nom: "B", email: "b@b.fr", message: "deux" });
    const res = await app.request("/api/contact");
    expect(res.status).toBe(200);
    const data = await json(res);
    expect(data).toHaveLength(2);
    expect(data[1]).toMatchObject({ nom: "B", email: "b@b.fr" });
  });
});
