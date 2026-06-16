import mysql from "mysql2/promise";
import type { DbConfig } from "./config.ts";
import { faqSeed, projectsSeed, servicesSeed, teamSeed } from "./data/seed.ts";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  initiales VARCHAR(8) NOT NULL
);
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no VARCHAR(8) NOT NULL,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  q VARCHAR(512) NOT NULL,
  a TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Crée un pool de connexions, attend que MySQL réponde (retries), applique le
 * schéma puis seed les tables de référence si elles sont vides.
 */
export async function createPool(cfg: DbConfig): Promise<mysql.Pool> {
  const pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
  });

  await waitForDb(pool);
  await pool.query(SCHEMA);
  await seed(pool);
  return pool;
}

async function waitForDb(pool: mysql.Pool, retries = 30): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`MySQL pas encore prêt (essai ${attempt}/${retries})...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

async function seed(pool: mysql.Pool): Promise<void> {
  await seedTable(pool, "team_members", teamSeed, (m) => [m.nom, m.role, m.initiales], "nom, role, initiales");
  await seedTable(pool, "services", servicesSeed, (s) => [s.no, s.title, s.text], "no, title, text");
  await seedTable(pool, "projects", projectsSeed, (p) => [p.tag, p.title, p.text], "tag, title, text");
  await seedTable(pool, "faq", faqSeed, (f) => [f.q, f.a], "q, a");
}

async function seedTable<T>(
  pool: mysql.Pool,
  table: string,
  rows: T[],
  toValues: (row: T) => unknown[],
  columns: string,
): Promise<void> {
  const [result] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM ${table}`,
  );
  if (Number(result[0].count) > 0) return;

  const placeholders = `(${columns.split(",").map(() => "?").join(", ")})`;
  for (const row of rows) {
    await pool.query(`INSERT INTO ${table} (${columns}) VALUES ${placeholders}`, toValues(row));
  }
  console.log(`Table ${table} seedée (${rows.length} lignes).`);
}
