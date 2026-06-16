import { createApp } from "./src/app.ts";
import { loadConfig } from "./src/config.ts";
import { createPool } from "./src/db.ts";
import { MysqlRepository } from "./src/repositories/mysql.ts";

const config = loadConfig();

const pool = await createPool(config.db);
const repo = new MysqlRepository(pool);
const app = createApp(repo);

console.log(`API « Atelier » à l'écoute sur http://localhost:${config.port}`);

export default {
  port: config.port,
  fetch: app.fetch,
};
