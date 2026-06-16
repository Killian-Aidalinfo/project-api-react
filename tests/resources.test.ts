import { describe, expect, it } from "bun:test";
import { createApp } from "../src/app.ts";
import { InMemoryRepository } from "../src/repositories/memory.ts";

function app() {
  return createApp(new InMemoryRepository());
}

// res.json() est typé `unknown` sous Bun ; helper pour alléger les tests.
const json = (res: Response): Promise<any> => res.json();

describe("GET /api/health", () => {
  it("renvoie 200 et status ok", async () => {
    const res = await app().request("/api/health");
    expect(res.status).toBe(200);
    expect(await json(res)).toEqual({ status: "ok" });
  });
});

describe("GET /api/team", () => {
  it("renvoie la liste des membres avec id, nom, role, initiales", async () => {
    const res = await app().request("/api/team");
    expect(res.status).toBe(200);
    const data = await json(res);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(4);
    expect(data[0]).toEqual({
      id: 1,
      nom: "Camille Roy",
      role: "Lead front-end",
      initiales: "CR",
    });
  });
});

describe("GET /api/services", () => {
  it("renvoie 4 services avec no, title, text", async () => {
    const res = await app().request("/api/services");
    expect(res.status).toBe(200);
    const data = await json(res);
    expect(data).toHaveLength(4);
    expect(data[0]).toMatchObject({ no: "01", title: "Conception d'interface" });
    expect(typeof data[0].id).toBe("number");
  });
});

describe("GET /api/projects", () => {
  it("renvoie 4 travaux avec tag, title, text", async () => {
    const res = await app().request("/api/projects");
    expect(res.status).toBe(200);
    const data = await json(res);
    expect(data).toHaveLength(4);
    expect(data[0]).toMatchObject({ tag: "Interface", title: "Tableau de bord" });
  });
});

describe("GET /api/faq", () => {
  it("renvoie 4 questions avec q et a", async () => {
    const res = await app().request("/api/faq");
    expect(res.status).toBe(200);
    const data = await json(res);
    expect(data).toHaveLength(4);
    expect(data[0]).toMatchObject({
      q: "Quelles technologies sont utilisées ?",
    });
    expect(typeof data[0].a).toBe("string");
  });
});
