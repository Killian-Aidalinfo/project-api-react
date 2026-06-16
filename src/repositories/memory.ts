import type {
  ContactMessage,
  FaqItem,
  NewContact,
  Project,
  Repository,
  Service,
  TeamMember,
} from "./types.ts";
import {
  faqSeed,
  projectsSeed,
  servicesSeed,
  teamSeed,
} from "../data/seed.ts";

/**
 * Implémentation en mémoire du Repository, seedée avec les mêmes données que
 * la base. Utilisée par les tests : déterministe et sans connexion réseau.
 */
export class InMemoryRepository implements Repository {
  private team: TeamMember[];
  private services: Service[];
  private projects: Project[];
  private faq: FaqItem[];
  private contacts: ContactMessage[] = [];
  private nextContactId = 1;

  constructor() {
    this.team = teamSeed.map((m, i) => ({ id: i + 1, ...m }));
    this.services = servicesSeed.map((s, i) => ({ id: i + 1, ...s }));
    this.projects = projectsSeed.map((p, i) => ({ id: i + 1, ...p }));
    this.faq = faqSeed.map((f, i) => ({ id: i + 1, ...f }));
  }

  async getTeam(): Promise<TeamMember[]> {
    return this.team;
  }

  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getFaq(): Promise<FaqItem[]> {
    return this.faq;
  }

  async listContacts(): Promise<ContactMessage[]> {
    return this.contacts;
  }

  async createContact(input: NewContact): Promise<number> {
    const id = this.nextContactId++;
    this.contacts.push({
      id,
      nom: input.nom,
      email: input.email,
      message: input.message,
      created_at: "2026-06-16T00:00:00.000Z",
    });
    return id;
  }
}
