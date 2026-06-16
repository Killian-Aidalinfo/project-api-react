import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type {
  ContactMessage,
  FaqItem,
  NewContact,
  Project,
  Repository,
  Service,
  TeamMember,
} from "./types.ts";

/**
 * Implémentation MySQL du Repository (production), s'appuie sur un pool mysql2.
 */
export class MysqlRepository implements Repository {
  constructor(private pool: Pool) {}

  async getTeam(): Promise<TeamMember[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT id, nom, role, initiales FROM team_members ORDER BY id",
    );
    return rows as TeamMember[];
  }

  async getServices(): Promise<Service[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT id, no, title, text FROM services ORDER BY id",
    );
    return rows as Service[];
  }

  async getProjects(): Promise<Project[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT id, tag, title, text FROM projects ORDER BY id",
    );
    return rows as Project[];
  }

  async getFaq(): Promise<FaqItem[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT id, q, a FROM faq ORDER BY id",
    );
    return rows as FaqItem[];
  }

  async listContacts(): Promise<ContactMessage[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT id, nom, email, message, created_at FROM contact_messages ORDER BY id",
    );
    return rows as ContactMessage[];
  }

  async createContact(input: NewContact): Promise<number> {
    const [result] = await this.pool.query<ResultSetHeader>(
      "INSERT INTO contact_messages (nom, email, message) VALUES (?, ?, ?)",
      [input.nom, input.email, input.message],
    );
    return result.insertId;
  }
}
